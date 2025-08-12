import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: string;
  headerActions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title, 
  icon, 
  headerActions 
}) => {
  return (
    <div className={`card ${className}`}>
      {(title || headerActions) && (
        <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-center">
            {title && (
              <h5 className="card-title mb-0">
                {icon && <i className={`${icon} me-2`}></i>}
                {title}
              </h5>
            )}
            {headerActions && headerActions}
          </div>
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card; 