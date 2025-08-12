import React from 'react';
import { useFinance } from '../context/FinanceContext';

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  variant: 'balance' | 'income' | 'expense';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, variant }) => {
  const getCardClass = (): string => {
    switch (variant) {
      case 'balance': return 'balance-card';
      case 'income': return 'income-card';
      case 'expense': return 'expense-card';
      default: return '';
    }
  };

  return (
    <div className={`stats-card ${getCardClass()}`}>
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="text-white-50 mb-2">{title}</h6>
          <h3 className="fw-bold">{value}</h3>
        </div>
        <div className="fs-1">
          <i className={icon}></i>
        </div>
      </div>
    </div>
  );
};

const StatsCards: React.FC = () => {
  const { getBalance, getIncome, getExpenses } = useFinance();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="row mb-4">
      <div className="col-md-4">
        <StatCard
          title="SALDO ATUAL"
          value={formatCurrency(getBalance())}
          icon="fas fa-wallet"
          variant="balance"
        />
      </div>
      <div className="col-md-4">
        <StatCard
          title="RECEITAS"
          value={formatCurrency(getIncome())}
          icon="fas fa-arrow-up"
          variant="income"
        />
      </div>
      <div className="col-md-4">
        <StatCard
          title="DESPESAS"
          value={formatCurrency(getExpenses())}
          icon="fas fa-arrow-down"
          variant="expense"
        />
      </div>
    </div>
  );
};

export default StatsCards; 