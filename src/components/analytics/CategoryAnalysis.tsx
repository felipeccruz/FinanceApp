import React from 'react';

interface AnalyticsData {
  totalExpenses: number;
  expenseCount: number;
}

interface CategoryAnalysisProps {
  categoryData: Record<string, number>;
  analytics: AnalyticsData;
  formatCurrency: (value: number) => string;
}

const CategoryAnalysis: React.FC<CategoryAnalysisProps> = ({ 
  categoryData, 
  analytics, 
  formatCurrency 
}) => {
  const topCategories = Object.entries(categoryData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  if (topCategories.length === 0) {
    return (
      <div className="card">
        <div className="card-header bg-white">
          <h5 className="card-title mb-0">
            <i className="fas fa-trophy me-2"></i>
            Análise Detalhada por Categoria
          </h5>
        </div>
        <div className="card-body">
          <div className="text-center text-muted py-4">
            <i className="fas fa-chart-bar fa-2x mb-3 d-block"></i>
            <p>Nenhuma despesa para analisar</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header bg-white">
        <h5 className="card-title mb-0">
          <i className="fas fa-trophy me-2"></i>
          Análise Detalhada por Categoria
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          {topCategories.map(([category, amount], index) => {
            const percentage = analytics.totalExpenses > 0 ? (amount / analytics.totalExpenses) * 100 : 0;
            const avgPerTransaction = analytics.expenseCount > 0 ? amount / analytics.expenseCount : 0;

            return (
              <div key={category} className="col-lg-6 mb-4">
                <div className="card border-0 bg-light">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center">
                        <span className={`badge ${
                          index === 0 ? 'bg-warning' : 
                          index === 1 ? 'bg-secondary' : 
                          index === 2 ? 'bg-info' : 
                          'bg-light text-dark'
                        } rounded-pill me-2`}>
                          #{index + 1}
                        </span>
                        <span className="fw-semibold">{category}</span>
                      </div>
                      <span className="fw-bold text-danger">{formatCurrency(amount)}</span>
                    </div>

                    <div className="progress mb-2" style={{ height: '8px' }}>
                      <div
                        className={`progress-bar ${
                          index === 0 ? 'bg-warning' : 
                          index === 1 ? 'bg-secondary' : 
                          index === 2 ? 'bg-info' : 
                          'bg-primary'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>

                    <div className="row">
                      <div className="col-6">
                        <small className="text-muted d-block">Participação</small>
                        <strong>{percentage.toFixed(1)}%</strong>
                      </div>
                      <div className="col-6">
                        <small className="text-muted d-block">Média/transação</small>
                        <strong>{formatCurrency(avgPerTransaction)}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Category Insights */}
        <div className="mt-3 pt-3 border-top">
          <div className="row">
            <div className="col-md-4">
              <small className="text-muted d-block">
                <i className="fas fa-crown me-1 text-warning"></i>
                <strong>Categoria dominante:</strong> {topCategories[0]?.[0]}
                ({((topCategories[0]?.[1] / analytics.totalExpenses) * 100 || 0).toFixed(1)}%)
              </small>
            </div>
            <div className="col-md-4">
              <small className="text-muted d-block">
                <i className="fas fa-list me-1 text-info"></i>
                <strong>Categorias ativas:</strong> {Object.keys(categoryData).length}
              </small>
            </div>
            <div className="col-md-4">
              <small className="text-muted d-block">
                <i className="fas fa-balance-scale me-1 text-secondary"></i>
                <strong>Distribuição:</strong> {Object.keys(categoryData).length > 3 ? 'Diversificada' : 'Concentrada'}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryAnalysis; 