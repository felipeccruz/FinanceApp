import React from 'react';
import { Card } from './ui';
import TransactionList from './transaction-components/TransactionList/TransactionList';

const TransactionsPage: React.FC = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">
          <i className="fas fa-exchange-alt me-2" style={{ color: '#667eea' }}></i>
          Transações
        </h2>
        <span className="text-muted">Gerencie todas as suas transações</span>
      </div>

      <Card 
        title="Histórico de Transações"
        icon="fas fa-list"
      >
        <TransactionList />
      </Card>
    </div>
  );
};

export default TransactionsPage; 