import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Transaction, TransactionFilter } from '../types';

const TransactionList: React.FC = () => {
    const { transactions, deleteTransaction, categories } = useFinance();
    const [filter, setFilter] = useState<TransactionFilter>({
        type: 'all',
        category: 'all',
        search: '',
        dateFrom: '',
        dateTo: '',
        amountFrom: '',
        amountTo: ''
    });
    const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const filteredTransactions = transactions
        .filter((transaction: Transaction) => {
            // Type filter
            const typeMatch = filter.type === 'all' || transaction.type === filter.type;

            // Category filter
            const categoryMatch = filter.category === 'all' || transaction.category === filter.category;

            // Search filter (description)
            const searchMatch = filter.search === '' ||
                transaction.description.toLowerCase().includes(filter.search.toLowerCase());

            // Date range filter
            const dateMatch = (!filter.dateFrom || transaction.date >= filter.dateFrom) &&
                             (!filter.dateTo || transaction.date <= filter.dateTo);

            // Amount range filter
            const amount = parseFloat(transaction.amount.toString());
            const amountMatch = (!filter.amountFrom || amount >= parseFloat(filter.amountFrom)) &&
                              (!filter.amountTo || amount <= parseFloat(filter.amountTo));

            return typeMatch && categoryMatch && searchMatch && dateMatch && amountMatch;
        })
        .sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const handleFilterChange = (key: keyof TransactionFilter, value: string): void => {
        setFilter({ ...filter, [key]: value });
    };

    const clearFilters = (): void => {
        setFilter({
            type: 'all',
            category: 'all',
            search: '',
            dateFrom: '',
            dateTo: '',
            amountFrom: '',
            amountTo: ''
        });
        setShowAdvancedFilters(false);
    };

    const hasActiveFilters = (): boolean => {
        return filter.type !== 'all' ||
               filter.category !== 'all' ||
               filter.search !== '' ||
               filter.dateFrom !== '' ||
               filter.dateTo !== '' ||
               filter.amountFrom !== '' ||
               filter.amountTo !== '';
    };

    const handleDelete = async (id: string): Promise<void> => {
        if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
            try {
                await deleteTransaction(id);
            } catch (error) {
                alert('Erro ao excluir transação: ' + (error as Error).message);
            }
        }
    };

    // Componente para versão mobile (cards)
    const MobileTransactionCard: React.FC<{ transaction: Transaction }> = ({ transaction }) => (
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
    );

    return (
        <div>
            {/* Search and Basic Filters */}
            <div className="card mb-4">
                <div className="card-header bg-white">
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 fw-semibold">
                            <i className="fas fa-filter me-2"></i>
                            Filtros e Busca
                        </h6>
                        <div className="d-flex gap-2">
                            {hasActiveFilters() && (
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={clearFilters}
                                >
                                    <i className="fas fa-times me-1"></i>
                                    Limpar
                                </button>
                            )}
                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            >
                                <i className={`fas ${showAdvancedFilters ? 'fa-chevron-up' : 'fa-chevron-down'} me-1`}></i>
                                Avançado
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    {/* Basic Filters Row */}
                    <div className="row mb-3">
                        <div className="col-lg-4 mb-3 mb-lg-0">
                            <label className="form-label fw-semibold">Buscar por descrição:</label>
                            <div className="input-group">
                                <span className="input-group-text">
                                    <i className="fas fa-search"></i>
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Digite para buscar..."
                                    value={filter.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                />
                                {filter.search && (
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => handleFilterChange('search', '')}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="col-lg-4 mb-3 mb-lg-0">
                            <label className="form-label fw-semibold">Tipo:</label>
                            <select
                                className="form-select"
                                value={filter.type}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                            >
                                <option value="all">Todos</option>
                                <option value="income">Receitas</option>
                                <option value="expense">Despesas</option>
                            </select>
                        </div>

                        <div className="col-lg-4">
                            <label className="form-label fw-semibold">Categoria:</label>
                            <select
                                className="form-select"
                                value={filter.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                            >
                                <option value="all">Todas</option>
                                {categories.map((category: any) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Advanced Filters */}
                    {showAdvancedFilters && (
                        <div className="border-top pt-3">
                            <div className="row">
                                <div className="col-lg-6 mb-3">
                                    <label className="form-label fw-semibold">Período:</label>
                                    <div className="row">
                                        <div className="col-6">
                                            <input
                                                type="date"
                                                className="form-control"
                                                placeholder="De"
                                                value={filter.dateFrom}
                                                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                                            />
                                            <small className="text-muted">De</small>
                                        </div>
                                        <div className="col-6">
                                            <input
                                                type="date"
                                                className="form-control"
                                                placeholder="Até"
                                                value={filter.dateTo}
                                                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                                            />
                                            <small className="text-muted">Até</small>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6 mb-3">
                                    <label className="form-label fw-semibold">Valor (R$):</label>
                                    <div className="row">
                                        <div className="col-6">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Mínimo"
                                                step="0.01"
                                                value={filter.amountFrom}
                                                onChange={(e) => handleFilterChange('amountFrom', e.target.value)}
                                            />
                                            <small className="text-muted">Mínimo</small>
                                        </div>
                                        <div className="col-6">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Máximo"
                                                step="0.01"
                                                value={filter.amountTo}
                                                onChange={(e) => handleFilterChange('amountTo', e.target.value)}
                                            />
                                            <small className="text-muted">Máximo</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results Summary */}
                    <div className="mt-3 pt-3 border-top">
                        <small className="text-muted">
                            <i className="fas fa-info-circle me-1"></i>
                            Mostrando {filteredTransactions.length} de {transactions.length} transações
                            {hasActiveFilters() && ' (filtrado)'}
                        </small>
                    </div>
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
                                    {filteredTransactions.map((transaction: Transaction) => (
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
                        {filteredTransactions.map((transaction: Transaction) => (
                            <MobileTransactionCard
                                key={transaction.id}
                                transaction={transaction}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default TransactionList; 