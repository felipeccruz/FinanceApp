import React, { useState } from 'react'
import { useFinance } from '../context/FinanceContext'

function Goals() {
    const { goals, addGoal, updateGoal, deleteGoal } = useFinance()
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        target_amount: '',
        current_amount: 0,
        category: 'savings',
        deadline: ''
    })

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.title || !formData.target_amount) {
            alert('Por favor, preencha todos os campos obrigatórios.')
            return
        }

        try {
            await addGoal({
                ...formData,
                target_amount: parseFloat(formData.target_amount),
                current_amount: parseFloat(formData.current_amount) || 0
            })

            setFormData({
                title: '',
                target_amount: '',
                current_amount: 0,
                category: 'savings',
                deadline: ''
            })

            setShowForm(false)
        } catch (error) {
            alert('Erro ao adicionar meta: ' + error.message)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const updateGoalProgress = async (goalId, amount) => {
        const goal = goals.find(g => g.id === goalId)
        if (goal) {
            const newAmount = Math.max(0, Math.min(goal.target_amount, parseFloat(amount) || 0))
            try {
                await updateGoal(goalId, {
                    current_amount: newAmount
                })
            } catch (error) {
                alert('Erro ao atualizar meta: ' + error.message)
            }
        }
    }

    const getProgressPercentage = (current, target) => {
        return Math.min(100, (current / target) * 100)
    }

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta meta?')) {
            try {
                await deleteGoal(id)
            } catch (error) {
                alert('Erro ao excluir meta: ' + error.message)
            }
        }
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">
                    <i className="fas fa-bullseye me-2" style={{ color: '#667eea' }}></i>
                    Metas Financeiras
                </h2>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    <i className="fas fa-plus me-2"></i>
                    Nova Meta
                </button>
            </div>

            {showForm && (
                <div className="card mb-4">
                    <div className="card-header bg-white">
                        <h5 className="card-title mb-0">
                            <i className="fas fa-plus-circle me-2"></i>
                            Adicionar Meta
                        </h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Título da Meta *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Ex: Comprar um carro"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Valor Alvo *</label>
                                        <div className="input-group">
                                            <span className="input-group-text">R$</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="target_amount"
                                                value={formData.target_amount}
                                                onChange={handleChange}
                                                placeholder="0,00"
                                                step="0.01"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Valor Atual</label>
                                        <div className="input-group">
                                            <span className="input-group-text">R$</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="current_amount"
                                                value={formData.current_amount}
                                                onChange={handleChange}
                                                placeholder="0,00"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Categoria</label>
                                        <select
                                            className="form-select"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                        >
                                            <option value="savings">Poupança</option>
                                            <option value="investment">Investimento</option>
                                            <option value="emergency">Emergência</option>
                                            <option value="purchase">Compra</option>
                                            <option value="vacation">Viagem</option>
                                            <option value="other">Outros</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">Data Limite</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-success">
                                    <i className="fas fa-save me-2"></i>
                                    Salvar
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                                    <i className="fas fa-times me-2"></i>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {goals.length === 0 ? (
                <div className="card">
                    <div className="card-body text-center py-5">
                        <i className="fas fa-bullseye fa-3x text-muted mb-3"></i>
                        <h5 className="text-muted">Nenhuma meta definida</h5>
                        <p className="text-muted">Crie sua primeira meta financeira para começar a organizar seus objetivos</p>
                    </div>
                </div>
            ) : (
                <div className="row">
                    {goals.map((goal) => {
                        const progress = getProgressPercentage(goal.current_amount, goal.target_amount)
                        const isCompleted = progress >= 100
                        const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && !isCompleted

                        return (
                            <div key={goal.id} className="col-lg-6 mb-4">
                                <div className={`card h-100 ${isCompleted ? 'border-success' : isOverdue ? 'border-danger' : ''}`}>
                                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-0 fw-bold">{goal.title}</h6>
                                            <small className="text-muted">
                                                <i className="fas fa-tag me-1"></i>
                                                {goal.category === 'savings' && 'Poupança'}
                                                {goal.category === 'investment' && 'Investimento'}
                                                {goal.category === 'emergency' && 'Emergência'}
                                                {goal.category === 'purchase' && 'Compra'}
                                                {goal.category === 'vacation' && 'Viagem'}
                                                {goal.category === 'other' && 'Outros'}
                                            </small>
                                        </div>
                                        <div className="dropdown">
                                            <button className="btn btn-link text-muted" data-bs-toggle="dropdown">
                                                <i className="fas fa-ellipsis-v"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li>
                                                    <button
                                                        className="dropdown-item text-danger"
                                                        onClick={() => handleDelete(goal.id)}
                                                    >
                                                        <i className="fas fa-trash me-2"></i>
                                                        Excluir
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between mb-2">
                                                <span className="text-muted">Progresso</span>
                                                <span className="fw-bold">{progress.toFixed(1)}%</span>
                                            </div>
                                            <div className="progress" style={{ height: '10px' }}>
                                                <div
                                                    className={`progress-bar ${isCompleted ? 'bg-success' : isOverdue ? 'bg-danger' : 'bg-primary'
                                                        }`}
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="row text-center mb-3">
                                            <div className="col-6">
                                                <div className="border-end">
                                                    <div className="text-muted small">Atual</div>
                                                    <div className="fw-bold text-primary">{formatCurrency(Number(goal.current_amount))}</div>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <div className="text-muted small">Meta</div>
                                                <div className="fw-bold">{formatCurrency(Number(goal.target_amount))}</div>
                                            </div>
                                        </div>

                                        {goal.deadline && (
                                            <div className="mb-3">
                                                <small className={`text-muted ${isOverdue ? 'text-danger' : ''}`}>
                                                    <i className="fas fa-calendar me-1"></i>
                                                    Data limite: {formatDate(goal.deadline)}
                                                    {isOverdue && <span className="ms-1">(Vencida)</span>}
                                                </small>
                                            </div>
                                        )}

                                        <div className="input-group">
                                            <span className="input-group-text">R$</span>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Atualizar valor"
                                                step="0.01"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        updateGoalProgress(goal.id, e.target.value)
                                                        e.target.value = ''
                                                    }
                                                }}
                                            />
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={(e) => {
                                                    const input = e.target.previousElementSibling
                                                    updateGoalProgress(goal.id, input.value)
                                                    input.value = ''
                                                }}
                                            >
                                                <i className="fas fa-check"></i>
                                            </button>
                                        </div>
                                    </div>

                                    {isCompleted && (
                                        <div className="card-footer bg-success text-white text-center">
                                            <i className="fas fa-check-circle me-2"></i>
                                            Meta Alcançada!
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Goals 