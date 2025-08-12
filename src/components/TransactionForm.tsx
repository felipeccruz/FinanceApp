import React, { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext';
import { TransactionFormData, Category } from '../types';
import { Input, Select, Button, MoneyInput } from './ui';

interface TransactionFormProps {
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose }) => {
  const { addTransaction, categories } = useFinance();
  const [formData, setFormData] = useState<TransactionFormData>({
    type: 'expense',
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Filter categories based on selected type
  const getFilteredCategories = (): Category[] => {
    return categories.filter((cat: Category) =>
      cat.type === formData.type || cat.type === 'both'
    );
  };

  // Update category when type changes
  useEffect(() => {
    const filteredCategories = getFilteredCategories();
    if (filteredCategories.length > 0 && !formData.category) {
      setFormData(prev => ({
        ...prev,
        category: filteredCategories[0].name
      }));
    }
  }, [formData.type, categories]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!formData.amount || !formData.description || !formData.category) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      await addTransaction({
        ...formData,
        amount: parseFloat(formData.amount)
      });

      setFormData({
        type: 'expense',
        amount: '',
        description: '',
        category: getFilteredCategories()[0]?.name || '',
        date: new Date().toISOString().split('T')[0]
      });

      onClose();
    } catch (error) {
      alert('Erro ao adicionar transação: ' + (error as Error).message);
    }
  };

  const handleChange = (name: keyof TransactionFormData, value: string): void => {
    if (name === 'type') {
      // When type changes, reset category to first available
      const transactionType = value as 'income' | 'expense';
      const filteredCategories = categories.filter((cat: Category) =>
        cat.type === transactionType || cat.type === 'both'
      );
      setFormData({
        ...formData,
        type: transactionType,
        category: filteredCategories[0]?.name || ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const filteredCategories = getFilteredCategories();

  const typeOptions = [
    { value: 'expense', label: 'Despesa' },
    { value: 'income', label: 'Receita' }
  ];

  const categoryOptions = filteredCategories.map((category: Category) => ({
    value: category.name,
    label: category.name
  }));

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6">
          <Select
            label="Tipo"
            name="type"
            value={formData.type}
            onChange={(value) => handleChange('type', value)}
            options={typeOptions}
          />
        </div>

        <div className="col-md-6">
          <MoneyInput
            label="Valor"
            name="amount"
            value={formData.amount}
            onChange={(value) => handleChange('amount', value)}
            placeholder="0,00"
            required
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <Input
            type="text"
            label="Descrição"
            value={formData.description}
            onChange={(value) => handleChange('description', value)}
            placeholder="Ex: Compra no supermercado"
            required
            className="mb-3"
          />
        </div>

        <div className="col-md-6">
          <Select
            label="Categoria"
            name="category"
            value={formData.category}
            onChange={(value) => handleChange('category', value)}
            options={categoryOptions}
            placeholder="Selecione uma categoria"
            required
            className="mb-3"
          />
        </div>
      </div>

      <Input
        type="date"
        label="Data"
        value={formData.date}
        onChange={(value) => handleChange('date', value)}
        required
        className="mb-3"
      />

      <div className="d-flex gap-2">
        <Button
          type="submit"
          variant="success"
          icon="fas fa-save"
        >
          Salvar
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          icon="fas fa-times"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default TransactionForm; 