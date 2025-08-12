import React from 'react';
import { Goal } from '../../types';
import GoalCard from './GoalCard';

interface GoalsListProps {
  goals: Goal[];
  title: string;
  icon: string;
  emptyMessage: string;
  emptyIcon: string;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onAddValue: (id: string, amount: number) => void;
  formatCurrency: (value: number) => string;
  formatDate: (date: string) => string;
}

const GoalsList: React.FC<GoalsListProps> = ({
  goals,
  title,
  icon,
  emptyMessage,
  emptyIcon,
  onEdit,
  onDelete,
  onArchive,
  onUnarchive,
  onAddValue,
  formatCurrency,
  formatDate
}) => {
  if (goals.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <i className={`${emptyIcon} fa-3x mb-3 d-block`}></i>
        <h5>{emptyMessage}</h5>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <h5 className="fw-bold mb-0">
          <i className={`${icon} me-2`}></i>
          {title}
        </h5>
        <span className="badge bg-primary ms-2">{goals.length}</span>
      </div>
      
      <div className="row">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEdit={onEdit}
            onDelete={onDelete}
            onArchive={onArchive}
            onUnarchive={onUnarchive}
            onAddValue={onAddValue}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        ))}
      </div>
    </div>
  );
};

export default GoalsList; 