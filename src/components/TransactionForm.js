import React, { useState, useEffect } from 'react'
import { useFinance } from '../context/FinanceContext'

function TransactionForm({ onClose }) {
    const { addTransaction, categories } = useFinance()
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0]
    })

    // Filtrar categorias baseado no tipo selecionado
    const getFilteredCategories = () => {
        return categories.filter(cat =>
            cat.type === formData.type || cat.type === 'both'
        )
    }

    // Atualizar categoria quando o tipo muda
    useEffect(() => {
        const filteredCategories = getFilteredCategories()
        if (filteredCategories.length > 0 && !formData.category) {
            setFormData(prev => ({
                ...prev,
                category: filteredCategories[0].name
            }))
        }
    }, [formData.type, categories])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.amount || !formData.description || !formData.category) {
            alert('Por favor, preencha todos os campos obrigatórios.')
            return
        }

        try {
            await addTransaction({
                ...formData,
                amount: parseFloat(formData.amount)
            })

            setFormData({
                type: 'expense',
                amount: '',
                description: '',
                category: getFilteredCategories()[0]?.name || '',
                date: new Date().toISOString().split('T')[0]
            })

            onClose()
        } catch (error) {
            alert('Erro ao adicionar transação: ' + error.message)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        if (name === 'type') {
            // Quando o tipo muda, resetar a categoria para a primeira disponível
            const filteredCategories = categories.filter(cat =>
                cat.type === value || cat.type === 'both'
            )
            setFormData({
                ...formData,
                [name]: value,
                category: filteredCategories[0]?.name || ''
            })
        } else {
            setFormData({
                ...formData,
                [name]: value
            })
        }
    }

    const filteredCategories = getFilteredCategories()

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Tipo</label>
                        <select
                            className="form-select"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                        >
                            <option value="expense">Despesa</option>
                            <option value="income">Receita</option>
                        </select>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Valor *</label>
                        <div className="input-group">
                            <span className="input-group-text">R$</span>
                            <input
                                type="number"
                                className="form-control"
                                name="amount"
                                value={formData.amount}
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
                        <label className="form-label fw-semibold">Descrição *</label>
                        <input
                            type="text"
                            className="form-control"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Ex: Compra no supermercado"
                            required
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Categoria *</label>
                        <select
                            className="form-select"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione uma categoria</option>
                            {filteredCategories.map(category => (
                                <option key={category.id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label fw-semibold">Data</label>
                <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="d-flex gap-2">
                <button type="submit" className="btn btn-success">
                    <i className="fas fa-save me-2"></i>
                    Salvar
                </button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                    <i className="fas fa-times me-2"></i>
                    Cancelar
                </button>
            </div>
        </form>
    )
}

export default TransactionForm 