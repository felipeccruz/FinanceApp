import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const UserProfile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="mb-4 p-3 rounded" style={{ background: 'rgba(255,255,255,0.1)' }}>
      <div className="d-flex align-items-center">
        <div 
          className="me-3 p-2 rounded-circle bg-white text-primary d-flex align-items-center justify-content-center"
          style={{ width: '40px', height: '40px' }}
        >
          <i className="fas fa-user"></i>
        </div>
        <div>
          <div className="fw-semibold">{user.email?.split('@')[0] || 'Usuário'}</div>
          <small className="opacity-75">{user.email}</small>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 