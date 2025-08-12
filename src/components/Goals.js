import React, { useState } from 'react'
import { useFinance } from '../context/FinanceContext'

function Goals() {
    const { goals, addGoal, updateGoal, deleteGoal } = useFinance()
    const [showForm, setShowForm] = useState(false)
    const [showArchived, setShowArchived] = useState(false)
    const [editingGoal, setEditingGoal] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        target_amount: '',
        current_amount: 0,
        category: 'savings',
        deadline: ''
    })
    const [editFormData, setEditFormData] = useState({
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

    const handleEditChange = (e) => {
        setEditFormData({
            ...editFormData,
            [e.target.name]: e.target.value
        })
    }

    const startEdit = (goal) => {
        setEditingGoal(goal.id)
        setEditFormData({
            title: goal.title,
            target_amount: goal.target_amount,
            current_amount: goal.current_amount,
            category: goal.category,
            deadline: goal.deadline || ''
        })
        setShowForm(false) // Close add form if open
    }

    const cancelEdit = () => {
        setEditingGoal(null)
        setEditFormData({
            title: '',
            target_amount: '',
            current_amount: 0,
            category: 'savings',
            deadline: ''
        })
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault()
        if (!editFormData.title || !editFormData.target_amount) {
            alert('Por favor, preencha todos os campos obrigatórios.')
            return
        }

        try {
            await updateGoal(editingGoal, {
                ...editFormData,
                target_amount: parseFloat(editFormData.target_amount),
                current_amount: parseFloat(editFormData.current_amount) || 0
            })

            cancelEdit()
        } catch (error) {
            alert('Erro ao atualizar meta: ' + error.message)
        }
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

    const addToGoalProgress = async (goalId, addAmount) => {
        const goal = goals.find(g => g.id === goalId)
        if (goal && addAmount > 0) {
            const currentAmount = parseFloat(goal.current_amount) || 0
            const amountToAdd = parseFloat(addAmount) || 0
            const newAmount = Math.max(0, Math.min(goal.target_amount, currentAmount + amountToAdd))

            // Check if goal will be completed with this addition
            const wasCompleted = currentAmount >= goal.target_amount
            const willBeCompleted = newAmount >= goal.target_amount

            try {
                const updateData = { current_amount: newAmount }

                // If goal is being completed for the first time, add completion date
                if (!wasCompleted && willBeCompleted) {
                    updateData.completed_date = new Date().toISOString().split('T')[0]
                }

                await updateGoal(goalId, updateData)

                // Show celebration message when goal is completed
                if (!wasCompleted && willBeCompleted) {
                    setTimeout(() => {
                        alert(`🎉 Parabéns! Você alcançou sua meta "${goal.title}"!\n\nAgora você pode arquivar esta meta ou definir uma nova.`)
                    }, 100)
                }
            } catch (error) {
                alert('Erro ao atualizar meta: ' + error.message)
            }
        }
    }

    const archiveGoal = async (goalId) => {
        console.log('Archive goal called with ID:', goalId)
        if (window.confirm('Deseja arquivar esta meta?')) {
            console.log('User confirmed archive')
            try {
                console.log('Attempting to update goal with archived: true')
                const result = await updateGoal(goalId, { archived: true })
                console.log('Archive result:', result)
            } catch (error) {
                console.error('Erro ao arquivar meta:', error)
                alert('Erro ao arquivar meta: ' + error.message)
            }
        } else {
            console.log('User cancelled archive')
        }
    }

    const unarchiveGoal = async (goalId) => {
        console.log('Unarchive goal called with ID:', goalId)
        if (window.confirm('Deseja desarquivar esta meta?')) {
            console.log('User confirmed unarchive')
            try {
                console.log('Attempting to update goal with archived: false')
                const result = await updateGoal(goalId, { archived: false })
                console.log('Unarchive result:', result)
            } catch (error) {
                console.error('Erro ao desarquivar meta:', error)
                alert('Erro ao desarquivar meta: ' + error.message)
            }
        } else {
            console.log('User cancelled unarchive')
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

            {editingGoal && (
                <div className="card mb-4">
                    <div className="card-header bg-white">
                        <h5 className="card-title mb-0">
                            <i className="fas fa-edit me-2"></i>
                            Editar Meta
                        </h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleEditSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Título da Meta *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="title"
                                            value={editFormData.title}
                                            onChange={handleEditChange}
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
                                                value={editFormData.target_amount}
                                                onChange={handleEditChange}
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
                                                value={editFormData.current_amount}
                                                onChange={handleEditChange}
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
                                            value={editFormData.category}
                                            onChange={handleEditChange}
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
                                    value={editFormData.deadline}
                                    onChange={handleEditChange}
                                />
                            </div>

                            <div className="d-flex gap-2">
                                <button type="submit" className="btn btn-success">
                                    <i className="fas fa-save me-2"></i>
                                    Salvar
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                                    <i className="fas fa-times me-2"></i>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Show archived toggle if there are archived goals */}
            {goals.some(goal => goal.archived) && (
                <div className="d-flex justify-content-end mb-3">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="showArchived"
                            checked={showArchived}
                            onChange={(e) => setShowArchived(e.target.checked)}
                        />
                        <label className="form-check-label text-muted" htmlFor="showArchived">
                            Mostrar metas arquivadas ({goals.filter(g => g.archived).length})
                        </label>
                    </div>
                </div>
            )}

            {/* Active Goals Section */}
            {goals.filter(goal => !goal.archived).length === 0 ? (
                <div className="card">
                    <div className="card-body text-center py-5">
                        <i className="fas fa-bullseye fa-3x text-muted mb-3"></i>
                        <h5 className="text-muted">Nenhuma meta ativa</h5>
                        <p className="text-muted">Crie sua primeira meta financeira para começar a organizar seus objetivos</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold mb-0">
                            <i className="fas fa-target me-2 text-primary"></i>
                            Metas Ativas
                        </h4>
                        <span className="badge bg-primary">{goals.filter(g => !g.archived).length}</span>
                    </div>

                    <div className="row">
                        {goals.filter(goal => !goal.archived).map((goal) => {
                            const progress = getProgressPercentage(goal.current_amount, goal.target_amount)
                            const isCompleted = progress >= 100
                            const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && !isCompleted
                            const isArchived = goal.archived

                            return (
                                <div key={goal.id} className="col-lg-6 mb-4">
                                    <div className={`card h-100 ${isCompleted ? 'border-success' : isOverdue ? 'border-danger' : isArchived ? 'border-secondary' : ''} ${isArchived ? 'opacity-75' : ''}`}>
                                        <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-0 fw-bold">
                                                    {goal.title}
                                                    {isArchived && <span className="badge bg-secondary ms-2 small">Arquivada</span>}
                                                </h6>
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
                                                    {isCompleted && (
                                                        <li>
                                                            <button
                                                                className="dropdown-item"
                                                                onClick={() => isArchived ? unarchiveGoal(goal.id) : archiveGoal(goal.id)}
                                                            >
                                                                <i className={`fas ${isArchived ? 'fa-undo' : 'fa-archive'} me-2`}></i>
                                                                {isArchived ? 'Desarquivar' : 'Arquivar'}
                                                            </button>
                                                        </li>
                                                    )}
                                                    <li>
                                                        <button
                                                            className="dropdown-item text-danger"
                                                            onClick={() => handleDelete(goal.id)}
                                                        >
                                                            <i className="fas fa-trash me-2"></i>
                                                            Excluir
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button
                                                            className="dropdown-item"
                                                            onClick={() => startEdit(goal)}
                                                        >
                                                            <i className="fas fa-edit me-2"></i>
                                                            Editar
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

                                            {isCompleted && goal.completed_date && (
                                                <div className="mb-3">
                                                    <small className="text-success">
                                                        <i className="fas fa-check-circle me-1"></i>
                                                        Concluída em: {formatDate(goal.completed_date)}
                                                    </small>
                                                </div>
                                            )}

                                            {!isArchived && !isCompleted && (
                                                <div className="input-group">
                                                    <span className="input-group-text">R$</span>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        placeholder="Adicionar valor"
                                                        step="0.01"
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                const value = e.target.value.trim()
                                                                if (value) {
                                                                    addToGoalProgress(goal.id, value)
                                                                    e.target.value = ''
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        className="btn btn-outline-primary"
                                                        onClick={(e) => {
                                                            const input = e.target.closest('.input-group').querySelector('input[type="number"]')
                                                            if (input && input.value.trim()) {
                                                                addToGoalProgress(goal.id, input.value.trim())
                                                                input.value = ''
                                                            }
                                                        }}
                                                    >
                                                        <i className="fas fa-plus"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {isCompleted && !isArchived && (
                                            <div className="card-footer bg-success text-white">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <i className="fas fa-check-circle me-2"></i>
                                                        Meta Alcançada!
                                                    </div>
                                                    <button
                                                        className="btn btn-light btn-sm"
                                                        onClick={() => archiveGoal(goal.id)}
                                                    >
                                                        <i className="fas fa-archive me-1"></i>
                                                        Arquivar
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {isArchived && (
                                            <div className="card-footer bg-secondary text-white text-center">
                                                <i className="fas fa-archive me-2"></i>
                                                Meta Arquivada
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </>
            )}

            {/* Archived Goals Section */}
            {showArchived && goals.filter(goal => goal.archived).length > 0 && (
                <>
                    <hr className="my-4" />
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold mb-0">
                            <i className="fas fa-archive me-2 text-secondary"></i>
                            Metas Arquivadas
                        </h4>
                        <span className="badge bg-secondary">{goals.filter(g => g.archived).length}</span>
                    </div>

                    <div className="row">
                        {goals.filter(goal => goal.archived).map((goal) => {
                            const progress = getProgressPercentage(goal.current_amount, goal.target_amount)
                            const isCompleted = progress >= 100
                            const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && !isCompleted
                            const isArchived = goal.archived

                            return (
                                <div key={goal.id} className="col-lg-6 mb-4">
                                    <div className={`card h-100 ${isCompleted ? 'border-success' : isOverdue ? 'border-danger' : isArchived ? 'border-secondary' : ''} ${isArchived ? 'opacity-75' : ''}`}>
                                        <div className="card-header bg-white d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-0 fw-bold">
                                                    {goal.title}
                                                    {isArchived && <span className="badge bg-secondary ms-2 small">Arquivada</span>}
                                                </h6>
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
                                                            className="dropdown-item"
                                                            onClick={() => unarchiveGoal(goal.id)}
                                                        >
                                                            <i className="fas fa-undo me-2"></i>
                                                            Desarquivar
                                                        </button>
                                                    </li>
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
                                                        className={`progress-bar ${isCompleted ? 'bg-success' : isOverdue ? 'bg-danger' : 'bg-secondary'}`}
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

                                            {isCompleted && goal.completed_date && (
                                                <div className="mb-3">
                                                    <small className="text-success">
                                                        <i className="fas fa-check-circle me-1"></i>
                                                        Concluída em: {formatDate(goal.completed_date)}
                                                    </small>
                                                </div>
                                            )}
                                        </div>

                                        <div className="card-footer bg-secondary text-white text-center">
                                            <i className="fas fa-archive me-2"></i>
                                            Meta Arquivada
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    )
}

export default Goals 