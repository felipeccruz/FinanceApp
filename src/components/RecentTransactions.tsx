import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { Transaction } from '../types';

interface RecentTransactionItemProps {
  transaction: Transaction;
}

const RecentTransactionItem: React.FC<RecentTransactionItemProps> = ({ transaction }) => {
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
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div className="d-flex align-items-center">
        <div 
          className={`me-3 p-2 rounded-circle d-flex align-items-center justify-content-center ${
            transaction.type === 'income' ? 'bg-success' : 'bg-danger'
          } text-white`} 
          style={{ width: '40px', height: '40px', minWidth: '40px', minHeight: '40px' }}
        >
          <i 
            className={`fas ${transaction.type === 'income' ? 'fa-plus' : 'fa-minus'}`} 
            style={{ fontSize: '14px' }}
          />
        </div>
        <div>
          <div className="fw-semibold">{transaction.description}</div>
          <small className="text-muted">{transaction.category}</small>
        </div>
      </div>
      <div className="text-end">
        <div className={`fw-semibold ${transaction.type === 'income' ? 'text-success' : 'text-danger'}`}>
          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
        </div>
        <small className="text-muted">{formatDate(transaction.date)}</small>
      </div>
    </div>
  );
};

const RecentTransactions: React.FC = () => {
  const { transactions } = useFinance();

  const recentTransactions = transactions
    .sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

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
      {recentTransactions.map((transaction: Transaction) => (
        <RecentTransactionItem 
          key={transaction.id} 
          transaction={transaction} 
        />
      ))}
    </div>
  );
};

export default RecentTransactions; 