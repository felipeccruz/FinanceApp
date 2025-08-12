import React from 'react';
import { Transaction } from '../../../types';
import { Button } from '../../ui';

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onDelete }) => {
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
          {transactions.map((transaction: Transaction) => (
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
                  onClick={() => onDelete(transaction.id)}
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
  );
};

export default TransactionTable; 