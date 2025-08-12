import React from 'react';
import { TransactionFilter, Category } from '../../../types';
import { Card, Button, Input } from '../../ui';

interface TransactionFiltersProps {
  filter: TransactionFilter;
  onFilterChange: (key: keyof TransactionFilter, value: string) => void;
  onClearFilter: () => void;
  categories: Category[];
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filter,
  onFilterChange,
  onClearFilter,
  categories
}) => {
  const clearAllFilters = (): void => {
    onClearFilter();
  };

  return (
    <Card 
      title="Filtros" 
      icon="fas fa-filter"
      headerActions={
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={clearAllFilters}
          icon="fas fa-times"
        >
          Limpar Filtros
        </Button>
      }
      className="mb-4"
    >
      <div className="row">
        {/* Search */}
        <Input
          type="search"
          placeholder="Digite para buscar..."
          value={filter.search}
          onChange={(value: string) => onFilterChange('search', value)}
          label="Buscar por descrição:"
          icon="fas fa-search"
          className="col-lg-4 mb-3 mb-lg-0"
        />

        {/* Type Filter */}
        <div className="col-lg-4 mb-3 mb-lg-0">
          <label className="form-label fw-semibold">Tipo:</label>
          <select
            className="form-select"
            value={filter.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="col-lg-4">
          <label className="form-label fw-semibold">Categoria:</label>
          <select
            className="form-select"
            value={filter.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
          >
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="row mt-3">
        <div className="col-lg-6">
              <label className="form-label fw-semibold">Período:</label>
              <div className="row">
                <Input
                  type="date"
                  placeholder="De"
                  value={filter.dateFrom}
              onChange={(value: string) => onFilterChange('dateFrom', value)}
                  className="col-6"
                />
                <Input
                  type="date"
                  placeholder="Até"
                  value={filter.dateTo}
              onChange={(value: string) => onFilterChange('dateTo', value)}
                  className="col-6"
                />
              </div>
            </div>

        <div className="col-lg-6">
          <label className="form-label fw-semibold">Faixa de Valor:</label>
              <div className="row">
                <Input
                  type="number"
                  placeholder="Mínimo"
                  value={filter.amountFrom}
              onChange={(value: string) => onFilterChange('amountFrom', value)}
                  step="0.01"
                  className="col-6"
                />
                <Input
                  type="number"
                  placeholder="Máximo"
                  value={filter.amountTo}
              onChange={(value: string) => onFilterChange('amountTo', value)}
                  step="0.01"
                  className="col-6"
                />
              </div>
            </div>
      </div>
    </Card>
  );
};

export default TransactionFilters; 