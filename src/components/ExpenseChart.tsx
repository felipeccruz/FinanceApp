import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { useFinance } from '../context/FinanceContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart: React.FC = () => {
  const { getTransactionsByCategory } = useFinance();

  const categoryData = getTransactionsByCategory();
  const categories = Object.keys(categoryData);
  const amounts = Object.values(categoryData);

  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#36A2EB'
  ];

  const data = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: colors.slice(0, categories.length),
        borderColor: colors.slice(0, categories.length),
        borderWidth: 2,
        hoverBorderWidth: 3
      }
    ]
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(context.raw as number);
            return `${context.label}: ${value}`;
          }
        }
      }
    }
  };

  if (categories.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        <i className="fas fa-chart-pie fa-2x mb-3 d-block"></i>
        <p>Nenhuma despesa para exibir</p>
      </div>
    );
  }

  return (
    <div style={{ height: '300px' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default ExpenseChart; 