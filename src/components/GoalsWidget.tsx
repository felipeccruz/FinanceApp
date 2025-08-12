import React from 'react';
import { Link } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import { Goal } from '../types';

interface GoalItemProps {
  goal: Goal;
}

const GoalItem: React.FC<GoalItemProps> = ({ goal }) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getProgressPercentage = (current: number, target: number): number => {
    return Math.min(100, (current / target) * 100);
  };

  const progress = getProgressPercentage(goal.current_amount, goal.target_amount);
  const isCompleted = progress >= 100;

  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <div className="fw-semibold text-truncate" style={{ maxWidth: '60%' }}>
          {goal.title}
        </div>
        <small className={`fw-bold ${isCompleted ? 'text-success' : 'text-primary'}`}>
          {progress.toFixed(0)}%
          {isCompleted && <i className="fas fa-check-circle ms-1"></i>}
        </small>
      </div>
      <div className="progress mb-1" style={{ height: '6px' }}>
        <div
          className={`progress-bar ${isCompleted ? 'bg-success' : 'bg-primary'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="d-flex justify-content-between">
        <small className="text-muted">
          {formatCurrency(Number(goal.current_amount))}
        </small>
        <small className="text-muted">
          {formatCurrency(Number(goal.target_amount))}
        </small>
      </div>
    </div>
  );
};

const GoalsWidget: React.FC = () => {
  const { goals } = useFinance();

  const getProgressPercentage = (current: number, target: number): number => {
    return Math.min(100, (current / target) * 100);
  };

  // Show active goals (not completed) first, then completed ones, limit to 4
  const displayGoals = goals
    .filter((goal: Goal) => !goal.archived) // Only show non-archived goals
    .sort((a: Goal, b: Goal) => {
      const progressA = getProgressPercentage(a.current_amount, a.target_amount);
      const progressB = getProgressPercentage(b.current_amount, b.target_amount);
      const completedA = progressA >= 100;
      const completedB = progressB >= 100;

      // Active goals first, then by progress descending
      if (completedA !== completedB) {
        return Number(completedA) - Number(completedB);
      }
      return progressB - progressA;
    })
    .slice(0, 4);

  const activeGoals = goals.filter((goal: Goal) => !goal.archived);

  if (activeGoals.length === 0) {
    return (
      <div className="text-center text-muted py-4">
        <i className="fas fa-bullseye fa-2x mb-3 d-block"></i>
        <p className="mb-2">Nenhuma meta definida</p>
        <Link to="/goals" className="btn btn-sm btn-primary">
          <i className="fas fa-plus me-1"></i>
          Criar Meta
        </Link>
      </div>
    );
  }

  return (
    <div>
      {displayGoals.map((goal: Goal) => (
        <GoalItem key={goal.id} goal={goal} />
      ))}

      {activeGoals.length > 4 && (
        <div className="text-center mt-3">
          <small className="text-muted">
            +{activeGoals.length - 4} metas adicionais
          </small>
        </div>
      )}

      <div className="text-center mt-3">
        <Link to="/goals" className="btn btn-sm btn-outline-primary">
          <i className="fas fa-bullseye me-1"></i>
          Ver Todas as Metas
        </Link>
      </div>
    </div>
  );
};

export default GoalsWidget; 