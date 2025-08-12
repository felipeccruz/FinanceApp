import React from 'react';
import { useFinance } from '../context/FinanceContext';

function RecentTransactions() {
    const { transactions } = useFinance();

    const recentTransactions = transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    if (recentTransactions.length === 0) {
        return (
            <div className="text-center text-muted py-4">
                <i className="fas fa-inbox fa-2x mb-3 d-block"></i>
                <p>Nenhuma transação encontrada</p>
            </div>
        );
    }

    return (
        <div>
            {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                        <div className={`me-3 p-2 rounded-circle d-flex align-items-center justify-content-center ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'
                            } text-white`} style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}>
                            <i className={`fas ${transaction.type === 'income' ? 'fa-plus' : 'fa-minus'}`} style={{ fontSize: '14px' }}></i>
                        </div>
                        <div>
                            <div className="fw-semibold">{transaction.description}</div>
                            <small className="text-muted">{transaction.category}</small>
                        </div>
                    </div>
                    <div className="text-end">
                        <div className={`fw-semibold ${transaction.type === 'income' ? 'text-success' : 'text-danger'
                            }`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </div>
                        <small className="text-muted">{formatDate(transaction.date)}</small>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RecentTransactions; 