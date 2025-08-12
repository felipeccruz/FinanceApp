import React from 'react'
import { useFinance } from '../context/FinanceContext'
import StatsCards from './StatsCards'
import RecentTransactions from './RecentTransactions'
import ExpenseChart from './ExpenseChart'
import GoalsWidget from './GoalsWidget'

function Dashboard() {
    const { transactions } = useFinance()

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
                    <div className="card mb-4">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-chart-pie me-2"></i>
                                Gastos por Categoria
                            </h5>
                        </div>
                        <div className="card-body">
                            <ExpenseChart />
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card mb-4">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-clock me-2"></i>
                                Transações Recentes
                            </h5>
                        </div>
                        <div className="card-body">
                            <RecentTransactions />
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header bg-white">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-bullseye me-2"></i>
                                Metas Financeiras
                            </h5>
                        </div>
                        <div className="card-body">
                            <GoalsWidget />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard 