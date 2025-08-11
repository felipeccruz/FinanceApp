import React, { useState } from 'react'
import { useFinance } from '../context/FinanceContext'

function TransactionList() {
    const { transactions, deleteTransaction, categories } = useFinance()
    const [filter, setFilter] = useState({ type: 'all', category: 'all' })

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    const filteredTransactions = transactions
        .filter(transaction => {
            const typeMatch = filter.type === 'all' || transaction.type === filter.type
            const categoryMatch = filter.category === 'all' || transaction.category === filter.category
            return typeMatch && categoryMatch
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date))

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
            try {
                await deleteTransaction(id)
            } catch (error) {
                alert('Erro ao excluir transação: ' + error.message)
            }
        }
    }

    return (
        <div>
            {/* Filtros */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <label className="form-label fw-semibold">Filtrar por tipo:</label>
                    <select
                        className="form-select"
                        value={filter.type}
                        onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                    >
                        <option value="all">Todos</option>
                        <option value="income">Receitas</option>
                        <option value="expense">Despesas</option>
                    </select>
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-semibold">Filtrar por categoria:</label>
                    <select
                        className="form-select"
                        value={filter.category}
                        onChange={(e) => setFilter({ ...filter, category: e.target.value })}
                    >
                        <option value="all">Todas</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredTransactions.length === 0 ? (
                <div className="text-center text-muted py-5">
                    <i className="fas fa-inbox fa-3x mb-3 d-block"></i>
                    <h5>Nenhuma transação encontrada</h5>
                    <p>Adicione uma nova transação para começar</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Descrição</th>
                                <th>Categoria</th>
                                <th>Tipo</th>
                                <th>Valor</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((transaction) => (
                                <tr key={transaction.id} className="transaction-row">
                                    <td>{formatDate(transaction.date)}</td>
                                    <td className="fw-semibold">{transaction.description}</td>
                                    <td>
                                        <span className="badge bg-light text-dark">
                                            {transaction.category}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'
                                            }`}>
                                            {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                                        </span>
                                    </td>
                                    <td className={`fw-bold ${transaction.type === 'income' ? 'text-success' : 'text-danger'
                                        }`}>
                                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDelete(transaction.id)}
                                            title="Excluir transação"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default TransactionList 