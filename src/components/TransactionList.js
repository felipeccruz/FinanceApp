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

    // Componente para versão mobile (cards)
    const MobileTransactionCard = ({ transaction }) => (
        <div className="card mb-3 transaction-card">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="flex-grow-1">
                        <h6 className="card-title mb-1 fw-semibold">{transaction.description}</h6>
                        <small className="text-muted">{formatDate(transaction.date)}</small>
                    </div>
                    <div className="text-end">
                        <div className={`h6 mb-1 fw-bold ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
                        </div>
                        <span className={`badge ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'}`}>
                            {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                        </span>
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-light text-dark">
                        <i className="fas fa-tag me-1"></i>
                        {transaction.category}
                    </span>
                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(transaction.id)}
                        title="Excluir transação"
                    >
                        <i className="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    )

    return (
        <div>
            {/* Filtros */}
            <div className="row mb-4">
                <div className="col-md-6 mb-3 mb-md-0">
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
                <>
                    {/* Versão Desktop - Tabela */}
                    <div className="d-none d-md-block">
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
                                                <span className={`badge ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'}`}>
                                                    {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                                                </span>
                                            </td>
                                            <td className={`fw-bold ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
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
                    </div>

                    {/* Versão Mobile - Cards */}
                    <div className="d-md-none">
                        {filteredTransactions.map((transaction) => (
                            <MobileTransactionCard
                                key={transaction.id}
                                transaction={transaction}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default TransactionList 