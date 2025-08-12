import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Goal } from '../types';
import { Button } from './ui';
import GoalForm from './goals/GoalForm';
import GoalsList from './goals/GoalsList';

interface GoalFormData {
  title: string;
  target_amount: string;
  current_amount: number;
  category: string;
  deadline: string;
}

const GoalsPage: React.FC = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useFinance();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showArchived, setShowArchived] = useState<boolean>(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleFormSubmit = async (formData: GoalFormData): Promise<void> => {
    try {
      if (editingGoal) {
        // Update existing goal
        await updateGoal(editingGoal.id, {
          title: formData.title,
          target_amount: parseFloat(formData.target_amount),
          current_amount: formData.current_amount,
          category: formData.category as Goal['category'],
          deadline: formData.deadline || undefined
        });
        console.log('Meta atualizada com sucesso!');
      } else {
        // Create new goal
        await addGoal({
          title: formData.title,
          target_amount: parseFloat(formData.target_amount),
          current_amount: formData.current_amount,
          category: formData.category as Goal['category'],
          deadline: formData.deadline || undefined
        });
        console.log('Meta criada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      throw error;
    }
  };

  const handleEdit = (goal: Goal): void => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleCloseForm = (): void => {
    setShowForm(false);
    setEditingGoal(null);
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      await deleteGoal(id);
      console.log('Meta excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
    }
  };

  const handleArchive = async (id: string): Promise<void> => {
    try {
      await updateGoal(id, { archived: true });
      console.log('Meta arquivada com sucesso!');
    } catch (error) {
      console.error('Erro ao arquivar meta:', error);
    }
  };

  const handleUnarchive = async (id: string): Promise<void> => {
    try {
      await updateGoal(id, { archived: false });
      console.log('Meta desarquivada com sucesso!');
    } catch (error) {
      console.error('Erro ao desarquivar meta:', error);
    }
  };

  const handleAddValue = async (id: string, amount: number): Promise<void> => {
    try {
      const goal = goals.find(g => g.id === id);
      if (!goal) return;

      const newAmount = goal.current_amount + amount;
      const updates: Partial<Goal> = { current_amount: newAmount };

      // Check if goal is completed
      if (newAmount >= goal.target_amount) {
        updates.completed_date = new Date().toISOString().split('T')[0];
      }

      await updateGoal(id, updates);
      console.log('Valor adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar valor:', error);
    }
  };

  // Filter goals
  const activeGoals = goals.filter(goal => !goal.archived);
  const archivedGoals = goals.filter(goal => goal.archived);

  // Sort active goals: incomplete first, then by progress descending
  const sortedActiveGoals = [...activeGoals].sort((a, b) => {
    const progressA = Math.min(100, (a.current_amount / a.target_amount) * 100);
    const progressB = Math.min(100, (b.current_amount / b.target_amount) * 100);
    const completedA = progressA >= 100;
    const completedB = progressB >= 100;

    if (completedA !== completedB) {
      return Number(completedA) - Number(completedB);
    }
    return progressB - progressA;
  });

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">
          <i className="fas fa-bullseye me-2" style={{ color: '#667eea' }}></i>
          Metas Financeiras
        </h2>
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            onClick={() => setShowArchived(!showArchived)}
            icon={showArchived ? 'fas fa-eye-slash' : 'fas fa-archive'}
          >
            {showArchived ? 'Ocultar Arquivadas' : 'Ver Arquivadas'}
          </Button>
          <Button
            variant="primary"
            onClick={() => setShowForm(true)}
            icon="fas fa-plus"
          >
            Nova Meta
          </Button>
        </div>
      </div>

      {/* Active Goals */}
      <GoalsList
        goals={sortedActiveGoals}
        title="Metas Ativas"
        icon="fas fa-target"
        emptyMessage="Nenhuma meta ativa encontrada"
        emptyIcon="fas fa-bullseye"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onArchive={handleArchive}
        onUnarchive={handleUnarchive}
        onAddValue={handleAddValue}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
      />

      {/* Archived Goals */}
      {showArchived && (
        <>
          <hr className="my-5" />
          <GoalsList
            goals={archivedGoals}
            title="Metas Arquivadas"
            icon="fas fa-archive"
            emptyMessage="Nenhuma meta arquivada encontrada"
            emptyIcon="fas fa-archive"
            onEdit={handleEdit}
            onDelete={handleDelete}
            onArchive={handleArchive}
            onUnarchive={handleUnarchive}
            onAddValue={handleAddValue}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        </>
      )}

      {/* Goal Form Modal */}
      <GoalForm
        isVisible={showForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        editingGoal={editingGoal}
      />
    </div>
  );
};

export default GoalsPage; 