import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { useFinance } from '../context/FinanceContext';
import AnalyticsCards from './analytics/AnalyticsCards';
import FinancialChart from './analytics/FinancialChart';
import CategoryAnalysis from './analytics/CategoryAnalysis';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement);

const ReportsPage: React.FC = () => {
    const { transactions, getIncome, getExpenses, getTransactionsByCategory, getBalance } = useFinance();
    const [selectedPeriod, setSelectedPeriod] = useState<string>('6'); // months

    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    // Enhanced analytics calculations
    const getAdvancedAnalytics = () => {
        const totalIncome = getIncome();
        const totalExpenses = getExpenses();
        const balance = getBalance();
        const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

        const avgTransactionAmount = transactions.length > 0
            ? transactions.reduce((sum, t) => sum + Number(t.amount), 0) / transactions.length
            : 0;

        const incomeTransactions = transactions.filter(t => t.type === 'income');
        const expenseTransactions = transactions.filter(t => t.type === 'expense');

        const avgIncomeAmount = incomeTransactions.length > 0
            ? incomeTransactions.reduce((sum, t) => sum + Number(t.amount), 0) / incomeTransactions.length
            : 0;

        const avgExpenseAmount = expenseTransactions.length > 0
            ? expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0) / expenseTransactions.length
            : 0;

        // Financial health score (0-100)
        let healthScore = 50; // baseline
        if (savingsRate > 20) healthScore += 25;
        else if (savingsRate > 10) healthScore += 15;
        else if (savingsRate < 0) healthScore -= 30;

        if (balance > totalExpenses) healthScore += 15;
        else if (balance < 0) healthScore -= 20;

        if (transactions.length > 10) healthScore += 10; // regular tracking

        return {
            totalIncome,
            totalExpenses,
            balance,
            savingsRate: Math.max(0, savingsRate),
            avgTransactionAmount,
            avgIncomeAmount,
            avgExpenseAmount,
            healthScore: Math.max(0, Math.min(100, healthScore)),
            transactionCount: transactions.length,
            incomeCount: incomeTransactions.length,
            expenseCount: expenseTransactions.length
        };
    };

    // Monthly data for selected period
    const getMonthlyData = () => {
        const months: string[] = [];
        const incomeData: number[] = [];
        const expenseData: number[] = [];
        const balanceData: number[] = [];

        const monthsCount = parseInt(selectedPeriod);

        for (let i = monthsCount - 1; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            months.push(date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }));

            const monthTransactions = transactions.filter(t => {
                const transactionDate = new Date(t.date);
                const transactionKey = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
                return transactionKey === monthKey;
            });

            const income = monthTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + Number(t.amount), 0);

            const expense = monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + Number(t.amount), 0);

            incomeData.push(income);
            expenseData.push(expense);
            balanceData.push(income - expense);
        }

        return { months, incomeData, expenseData, balanceData };
    };

    const monthlyData = getMonthlyData();
    const analytics = getAdvancedAnalytics();
    const categoryData = getTransactionsByCategory();

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">
                    <i className="fas fa-chart-line me-2" style={{ color: '#667eea' }}></i>
                    Análise Avançada
                </h2>
                <span className="text-muted">Insights detalhados das suas finanças</span>
            </div>

            {/* Analytics Cards */}
            <AnalyticsCards analytics={analytics} formatCurrency={formatCurrency} />

            {/* Financial Chart */}
            <FinancialChart 
                monthlyData={monthlyData}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
                formatCurrency={formatCurrency}
            />

            {/* Category Analysis */}
            <CategoryAnalysis 
                categoryData={categoryData}
                analytics={analytics}
                formatCurrency={formatCurrency}
            />
        </div>
    );
};

export default ReportsPage; 