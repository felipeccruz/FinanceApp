import React from 'react';
import { useFinance } from '../context/FinanceContext';

function StatsCards() {
    const { getBalance, getIncome, getExpenses } = useFinance();

    const balance = getBalance();
    const income = getIncome();
    const expenses = getExpenses();

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <div className="row mb-4">
            <div className="col-md-4">
                <div className="stats-card balance-card">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 className="text-white-50 mb-2">SALDO ATUAL</h6>
                            <h3 className="fw-bold">{formatCurrency(balance)}</h3>
                        </div>
                        <div className="fs-1">
                            <i className="fas fa-wallet"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-4">
                <div className="stats-card income-card">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 className="text-white-50 mb-2">RECEITAS</h6>
                            <h3 className="fw-bold">{formatCurrency(income)}</h3>
                        </div>
                        <div className="fs-1">
                            <i className="fas fa-arrow-up"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-4">
                <div className="stats-card expense-card">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 className="text-white-50 mb-2">DESPESAS</h6>
                            <h3 className="fw-bold">{formatCurrency(expenses)}</h3>
                        </div>
                        <div className="fs-1">
                            <i className="fas fa-arrow-down"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatsCards; 