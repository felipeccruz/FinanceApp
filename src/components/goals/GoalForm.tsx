import React, { useState, useEffect } from 'react';
import { Button, Input, Select } from '../ui';

interface GoalFormData {
  title: string;
  target_amount: string;
  current_amount: number;
  category: string;
  deadline: string;
}

interface Goal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  category: string;
  deadline?: string;
}

interface GoalFormProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => Promise<void>;
  editingGoal?: Goal | null;
}

const GoalForm: React.FC<GoalFormProps> = ({ isVisible, onClose, onSubmit, editingGoal }) => {
  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    target_amount: '',
    current_amount: 0,
    category: 'savings',
    deadline: ''
  });

  // Update form when editing goal changes
  useEffect(() => {
    if (editingGoal) {
      setFormData({
        title: editingGoal.title,
        target_amount: editingGoal.target_amount.toString(),
        current_amount: editingGoal.current_amount,
        category: editingGoal.category,
        deadline: editingGoal.deadline || ''
      });
    } else {
      setFormData({
        title: '',
        target_amount: '',
        current_amount: 0,
        category: 'savings',
        deadline: ''
      });
    }
  }, [editingGoal]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!formData.title || !formData.target_amount) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({
        title: '',
        target_amount: '',
        current_amount: 0,
        category: 'savings',
        deadline: ''
      });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
    }
  };

  const handleChange = (field: keyof GoalFormData, value: string | number): void => {
    setFormData({ ...formData, [field]: value });
  };

  const categoryOptions = [
    { value: 'savings', label: 'Economia' },
    { value: 'investment', label: 'Investimento' },
    { value: 'emergency', label: 'Emergência' },
    { value: 'purchase', label: 'Compra' },
    { value: 'vacation', label: 'Viagem' },
    { value: 'other', label: 'Outros' }
  ];

  if (!isVisible) return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1}>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-bullseye me-2"></i>
              {editingGoal ? 'Editar Meta' : 'Nova Meta'}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <Input
                type="text"
                label="Título da Meta"
                value={formData.title}
                onChange={(value) => handleChange('title', value)}
                placeholder="Ex: Comprar um carro"
                required
                className="mb-3"
              />

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Valor da Meta <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">R$</span>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.target_amount}
                        onChange={(e) => handleChange('target_amount', e.target.value)}
                        placeholder="0,00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Valor Atual</label>
                    <div className="input-group">
                      <span className="input-group-text">R$</span>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.current_amount}
                        onChange={(e) => handleChange('current_amount', parseFloat(e.target.value) || 0)}
                        placeholder="0,00"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Select
                label="Categoria"
                name="category"
                value={formData.category}
                onChange={(value) => handleChange('category', value)}
                options={categoryOptions}
                className="mb-3"
              />

              <Input
                type="date"
                label="Data Limite (Opcional)"
                value={formData.deadline}
                onChange={(value) => handleChange('deadline', value)}
                className="mb-3"
              />
            </div>

            <div className="modal-footer">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                icon="fas fa-save"
              >
                {editingGoal ? 'Atualizar' : 'Criar Meta'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GoalForm; 