import React from 'react';
import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

interface MonthlyData {
  months: string[];
  incomeData: number[];
  expenseData: number[];
  balanceData: number[];
}

interface FinancialChartProps {
  monthlyData: MonthlyData;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  formatCurrency: (value: number) => string;
}

const FinancialChart: React.FC<FinancialChartProps> = ({ 
  monthlyData, 
  selectedPeriod, 
  onPeriodChange, 
  formatCurrency 
}) => {
  // Enhanced line chart with balance
  const lineChartData = {
    labels: monthlyData.months,
    datasets: [
      {
        label: 'Receitas',
        data: monthlyData.incomeData,
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        tension: 0.4,
        fill: false
      },
      {
        label: 'Despesas',
        data: monthlyData.expenseData,
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        tension: 0.4,
        fill: false
      },
      {
        label: 'Saldo Mensal',
        data: monthlyData.balanceData,
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Evolução Financeira - Últimos ${selectedPeriod} Meses`
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatCurrency(context.raw as number)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value as number);
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">
          <i className="fas fa-chart-line me-2"></i>
          Evolução Financeira Detalhada
        </h5>
        <select
          className="form-select"
          style={{ width: 'auto' }}
          value={selectedPeriod}
          onChange={(e) => onPeriodChange(e.target.value)}
        >
          <option value="3">Últimos 3 Meses</option>
          <option value="6">Últimos 6 Meses</option>
          <option value="12">Últimos 12 Meses</option>
        </select>
      </div>
      <div className="card-body">
        <div style={{ height: '400px' }}>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
        
        {/* Trend Insights */}
        <div className="mt-3 pt-3 border-top">
          <h6 className="fw-semibold mb-3">
            <i className="fas fa-lightbulb me-2 text-warning"></i>
            Insights de Tendência
          </h6>
          <div className="row">
            <div className="col-md-6">
              <small className="text-muted d-block">
                <i className="fas fa-trending-up me-1 text-success"></i>
                <strong>Melhor mês:</strong> {monthlyData.months[monthlyData.balanceData.indexOf(Math.max(...monthlyData.balanceData))]}
                ({formatCurrency(Math.max(...monthlyData.balanceData))})
              </small>
            </div>
            <div className="col-md-6">
              <small className="text-muted d-block">
                <i className="fas fa-trending-down me-1 text-danger"></i>
                <strong>Pior mês:</strong> {monthlyData.months[monthlyData.balanceData.indexOf(Math.min(...monthlyData.balanceData))]}
                ({formatCurrency(Math.min(...monthlyData.balanceData))})
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialChart; 