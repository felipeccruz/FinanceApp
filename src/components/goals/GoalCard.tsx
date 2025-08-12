import React, { useState } from 'react';
import { Goal } from '../../types';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onAddValue: (id: string, amount: number) => void;
  formatCurrency: (value: number) => string;
  formatDate: (date: string) => string;
}

const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
  onAddValue,
  formatCurrency,
  formatDate
}) => {
  const [addAmount, setAddAmount] = useState<string>('');

  const progress = Math.min(100, (goal.current_amount / goal.target_amount) * 100);
  const isCompleted = progress >= 100;
  const isOverdue = goal.deadline ? new Date(goal.deadline) < new Date() && !isCompleted : false;

  const handleAddValue = (e: React.FormEvent): void => {
    e.preventDefault();
    const amount = parseFloat(addAmount);
    if (!isNaN(amount) && amount > 0) {
      onAddValue(goal.id, amount);
      setAddAmount('');
    }
  };

  const handleDelete = (): void => {
    if (window.confirm('Tem certeza que deseja excluir esta meta?')) {
      onDelete(goal.id);
    }
  };

  const handleArchive = (): void => {
    if (window.confirm('Tem certeza que deseja arquivar esta meta?')) {
      onArchive(goal.id);
    }
  };

  const getCategoryLabel = (category: string): string => {
    const categories: Record<string, string> = {
      savings: 'Economia',
      investment: 'Investimento', 
      emergency: 'Emergência',
      purchase: 'Compra',
      vacation: 'Viagem',
      other: 'Outros'
    };
    return categories[category] || category;
  };

  const getStatusBadge = () => {
    if (isCompleted) {
      return <span className="badge bg-success">Concluída</span>;
    }
    if (isOverdue) {
      return <span className="badge bg-danger">Vencida</span>;
    }
    return <span className="badge bg-primary">Em andamento</span>;
  };

  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className={`card h-100 ${goal.archived ? 'border-secondary' : isCompleted ? 'border-success' : isOverdue ? 'border-danger' : ''}`}>
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <h6 className="card-title mb-1">{goal.title}</h6>
            <small className="text-muted">
              <i className="fas fa-tag me-1"></i>
              {getCategoryLabel(goal.category)}
            </small>
          </div>
          <div className="d-flex align-items-center gap-2">
            {getStatusBadge()}
            <div className="dropdown">
              <button className="btn btn-link text-muted" data-bs-toggle="dropdown">
                <i className="fas fa-ellipsis-v"></i>
              </button>
              <ul className="dropdown-menu">
                {!goal.archived && (
                  <>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => onEdit(goal)}
                      >
                        <i className="fas fa-edit me-2"></i>
                        Editar
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={handleArchive}
                      >
                        <i className="fas fa-archive me-2"></i>
                        Arquivar
                      </button>
                    </li>
                  </>
                )}
                {goal.archived && (
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => onUnarchive(goal.id)}
                    >
                      <i className="fas fa-undo me-2"></i>
                      Desarquivar
                    </button>
                  </li>
                )}
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleDelete}
                  >
                    <i className="fas fa-trash me-2"></i>
                    Excluir
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="mb-3">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Progresso</span>
              <span className="fw-bold">{progress.toFixed(1)}%</span>
            </div>
            <div className="progress" style={{ height: '10px' }}>
              <div
                className={`progress-bar ${
                  isCompleted ? 'bg-success' : 
                  isOverdue ? 'bg-danger' : 
                  goal.archived ? 'bg-secondary' : 'bg-primary'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="row text-center mb-3">
            <div className="col-6">
              <div className="border-end">
                <div className="text-muted small">Atual</div>
                <div className="fw-bold text-primary">{formatCurrency(Number(goal.current_amount))}</div>
              </div>
            </div>
            <div className="col-6">
              <div className="text-muted small">Meta</div>
              <div className="fw-bold">{formatCurrency(Number(goal.target_amount))}</div>
            </div>
          </div>

          {goal.deadline && (
            <div className="mb-3">
              <small className={`text-muted ${isOverdue ? 'text-danger' : ''}`}>
                <i className="fas fa-calendar me-1"></i>
                Data limite: {formatDate(goal.deadline)}
                {isOverdue && <span className="ms-1">(Vencida)</span>}
              </small>
            </div>
          )}

          {isCompleted && goal.completed_date && (
            <div className="mb-3">
              <small className="text-success">
                <i className="fas fa-check-circle me-1"></i>
                Concluída em: {formatDate(goal.completed_date)}
              </small>
            </div>
          )}

          {/* Add Value Form - Only show for active, non-completed goals */}
          {!goal.archived && !isCompleted && (
            <form onSubmit={handleAddValue} className="mt-3">
              <label className="form-label fw-semibold">
                <i className="fas fa-plus-circle me-1 text-success"></i>
                Adicionar valor
              </label>
              <div className="input-group">
                <span className="input-group-text">R$</span>
                <input
                  type="number"
                  className="form-control"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                />
                <button type="submit" className="btn btn-success" disabled={!addAmount}>
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </form>
          )}
        </div>

        {goal.archived && (
          <div className="card-footer bg-secondary text-white text-center">
            <i className="fas fa-archive me-2"></i>
            Meta Arquivada
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalCard; 