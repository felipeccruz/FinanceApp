import React from 'react';

interface AnalyticsData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  savingsRate: number;
  avgTransactionAmount: number;
  avgIncomeAmount: number;
  avgExpenseAmount: number;
  healthScore: number;
  transactionCount: number;
  incomeCount: number;
  expenseCount: number;
}

interface AnalyticsCardsProps {
  analytics: AnalyticsData;
  formatCurrency: (value: number) => string;
}

const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ analytics, formatCurrency }) => {
  return (
    <div className="row mb-4">
      {/* Savings Rate - Centralized */}
      <div className="col-lg-6 mx-auto mb-3">
        <div className="card h-100 border-0 shadow-sm">
          <div className="card-body text-center">
            <div className="mb-3">
              <h1 className="fw-bold text-primary mb-0 display-4">{analytics.savingsRate.toFixed(1)}%</h1>
            </div>
            <h5 className="card-title">Taxa de Poupança</h5>
            <p className="card-text text-muted">
              Percentual da renda que você consegue economizar mensalmente
            </p>
            <small className={`badge fs-6 ${analytics.savingsRate > 20 ? 'bg-success' : analytics.savingsRate > 10 ? 'bg-warning' : 'bg-danger'}`}>
              {analytics.savingsRate > 20 ? 'Excelente' : analytics.savingsRate > 10 ? 'Bom' : 'Precisa Melhorar'}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCards; 