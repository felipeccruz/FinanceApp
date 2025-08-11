import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useFinance } from '../context/FinanceContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Reports() {
    const { transactions, getIncome, getExpenses, getTransactionsByCategory } = useFinance();

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    // Dados para gráfico de linha (últimos 6 meses)
    const getMonthlyData = () => {
        const months = [];
        const incomeData = [];
        const expenseData = [];

        for (let i = 5; i >= 0; i--) {
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
                .reduce((sum, t) => sum + t.amount, 0);

            const expense = monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            incomeData.push(income);
            expenseData.push(expense);
        }

        return { months, incomeData, expenseData };
    };

    const monthlyData = getMonthlyData();

    const lineChartData = {
        labels: monthlyData.months,
        datasets: [
            {
                label: 'Receitas',
                data: monthlyData.incomeData,
                borderColor: '#28a745',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                tension: 0.4
            },
            {
                label: 'Despesas',
                data: monthlyData.expenseData,
                borderColor: '#dc3545',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                tension: 0.4
            }
        ]
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Evolução Mensal - Receitas vs Despesas'
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return formatCurrency(value);
                    }
                }
            }
        }
    };

    const categoryData = getTransactionsByCategory();
    const topCategories = Object.entries(categoryData)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">
                    <i className="fas fa-chart-bar me-2" style={{ color: '#667eea' }}></i>
                    Relatórios
                </h2>
                <span className="text-muted">Análise detalhada das suas finanças</span>
            </div>

            {/* Resumo Estatístico */}
            <div className="row mb-4">
                <div className="col-lg-4">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title text-primary">
                                <i className="fas fa-calculator me-2"></i>
                                Total de Transações
                            </h5>
                            <h3 className="fw-bold">{transactions.length}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title text-success">
                                <i className="fas fa-arrow-up me-2"></i>
                                Maior Receita
                            </h5>
                            <h3 className="fw-bold text-success">
                                {formatCurrency(Math.max(...transactions.filter(t => t.type === 'income').map(t => t.amount), 0))}
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card text-center">
                        <div className="card-body">
                            <h5 className="card-title text-danger">
                                <i className="fas fa-arrow-down me-2"></i>
                                Maior Despesa
                            </h5>
                            <h3 className="fw-bold text-danger">
                                {formatCurrency(Math.max(...transactions.filter(t => t.type === 'expense').map(t => t.amount), 0))}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gráfico de Linha */}
            <div className="card mb-4">
                <div className="card-header bg-white">
                    <h5 className="card-title mb-0">
                        <i className="fas fa-chart-line me-2"></i>
                        Evolução Mensal
                    </h5>
                </div>
                <div className="card-body">
                    <div style={{ height: '400px' }}>
                        <Line data={lineChartData} options={lineChartOptions} />
                    </div>
                </div>
            </div>

            {/* Top Categorias */}
            <div className="card">
                <div className="card-header bg-white">
                    <h5 className="card-title mb-0">
                        <i className="fas fa-trophy me-2"></i>
                        Top 5 Categorias de Gastos
                    </h5>
                </div>
                <div className="card-body">
                    {topCategories.length === 0 ? (
                        <div className="text-center text-muted py-4">
                            <i className="fas fa-chart-bar fa-2x mb-3 d-block"></i>
                            <p>Nenhuma despesa para analisar</p>
                        </div>
                    ) : (
                        <div className="list-group list-group-flush">
                            {topCategories.map(([category, amount], index) => (
                                <div key={category} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <span className="badge bg-primary rounded-pill me-3">{index + 1}</span>
                                        <span className="fw-semibold">{category}</span>
                                    </div>
                                    <span className="fw-bold text-danger">{formatCurrency(amount)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Reports; 