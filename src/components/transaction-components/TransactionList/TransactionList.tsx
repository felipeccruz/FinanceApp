import React, { useState } from 'react';
import { useFinance } from '../../../context/FinanceContext';
import { Transaction, TransactionFilter } from '../../../types';
import { TransactionFilters, TransactionTable, TransactionCard } from '../';

const TransactionList: React.FC = () => {
  const { transactions, deleteTransaction, categories } = useFinance();
  const [filter, setFilter] = useState<TransactionFilter>({
    type: 'all',
    category: 'all',
    search: '',
    dateFrom: '',
    dateTo: '',
    amountFrom: '',
    amountTo: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  const filteredTransactions = transactions
    .filter((transaction: Transaction) => {
      // Type filter
      const typeMatch = filter.type === 'all' || transaction.type === filter.type;

      // Category filter
      const categoryMatch = filter.category === 'all' || transaction.category === filter.category;

      // Search filter (description)
      const searchMatch = filter.search === '' ||
        transaction.description.toLowerCase().includes(filter.search.toLowerCase());

      // Date range filter
      const dateMatch = (!filter.dateFrom || transaction.date >= filter.dateFrom) &&
                       (!filter.dateTo || transaction.date <= filter.dateTo);

      // Amount range filter
      const amount = parseFloat(transaction.amount.toString());
      const amountMatch = (!filter.amountFrom || amount >= parseFloat(filter.amountFrom)) &&
                        (!filter.amountTo || amount <= parseFloat(filter.amountTo));

      return typeMatch && categoryMatch && searchMatch && dateMatch && amountMatch;
    })
    .sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleFilterChange = (key: keyof TransactionFilter, value: string): void => {
    setFilter({ ...filter, [key]: value });
  };

  const clearFilters = (): void => {
    setFilter({
      type: 'all',
      category: 'all',
      search: '',
      dateFrom: '',
      dateTo: '',
      amountFrom: '',
      amountTo: ''
    });
    setShowAdvancedFilters(false);
  };

  const hasActiveFilters = (): boolean => {
    return filter.type !== 'all' ||
           filter.category !== 'all' ||
           filter.search !== '' ||
           filter.dateFrom !== '' ||
           filter.dateTo !== '' ||
           filter.amountFrom !== '' ||
           filter.amountTo !== '';
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        alert('Erro ao excluir transação: ' + (error as Error).message);
      }
    }
  };

  if (filteredTransactions.length === 0 && !hasActiveFilters()) {
    return (
      <div>
        <TransactionFilters
          filter={filter}
          onFilterChange={handleFilterChange}
          onClearFilter={clearFilters}
          categories={categories}
        />
        
        <div className="text-center text-muted py-5">
          <i className="fas fa-inbox fa-3x mb-3 d-block"></i>
          <h5>Nenhuma transação encontrada</h5>
          <p>Adicione uma nova transação para começar</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <TransactionFilters
        filter={filter}
        onFilterChange={handleFilterChange}
        onClearFilter={clearFilters}
        categories={categories}
      />

      {filteredTransactions.length === 0 ? (
        <div className="text-center text-muted py-5">
          <i className="fas fa-search fa-3x mb-3 d-block"></i>
          <h5>Nenhuma transação encontrada</h5>
          <p>Tente ajustar os filtros para encontrar o que procura</p>
        </div>
      ) : (
        <>
          {/* Desktop View */}
          <div className="d-none d-lg-block">
            <TransactionTable 
              transactions={filteredTransactions} 
              onDelete={handleDelete} 
            />
          </div>

          {/* Mobile View */}
          <div className="d-lg-none">
            {filteredTransactions.map((transaction: Transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionList; 