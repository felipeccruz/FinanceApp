import React from 'react';
import { Transaction } from '../../../types';

interface TransactionCardProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onDelete }) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
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
            onClick={() => onDelete(transaction.id)}
            title="Excluir transação"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard; 