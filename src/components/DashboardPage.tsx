import React from 'react';
import { Card } from './ui';
import StatsCards from './StatsCards';
import RecentTransactions from './RecentTransactions';
import ExpenseChart from './ExpenseChart';
import GoalsWidget from './GoalsWidget';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">
          <i className="fas fa-tachometer-alt me-2" style={{ color: '#667eea' }}></i>
          Dashboard
        </h2>
        <span className="text-muted">Visão geral das suas finanças</span>
      </div>

      <StatsCards />

      <div className="row">
        <div className="col-lg-8">
          <Card 
            title="Gastos por Categoria"
            icon="fas fa-chart-pie"
            className="mb-4"
          >
            <ExpenseChart />
          </Card>
        </div>

        <div className="col-lg-4">
          <Card 
            title="Transações Recentes"
            icon="fas fa-clock"
            className="mb-4"
          >
            <RecentTransactions />
          </Card>

          <Card 
            title="Metas Financeiras"
            icon="fas fa-bullseye"
          >
            <GoalsWidget />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 