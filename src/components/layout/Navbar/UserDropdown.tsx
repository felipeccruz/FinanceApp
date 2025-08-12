import React from 'react';
import { useAuth } from '../../../context/AuthContext';

const UserDropdown: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="nav-item dropdown">
      <a
        className="nav-link dropdown-toggle d-flex align-items-center"
        href="#"
        role="button"
        data-bs-toggle="dropdown"
      >
        <div 
          className="me-2 p-1 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
          style={{ width: '32px', height: '32px', fontSize: '14px' }}
        >
          <i className="fas fa-user"></i>
        </div>
        <div className="d-flex flex-column align-items-start d-none d-md-flex">
          <small className="text-muted mb-0" style={{ fontSize: '11px' }}>Olá,</small>
          <span className="fw-semibold" style={{ fontSize: '13px', lineHeight: '1' }}>
            {user.email?.split('@')[0] || 'Usuário'}
          </span>
        </div>
      </a>
      <ul className="dropdown-menu dropdown-menu-end">
        <li>
          <div className="dropdown-item-text">
            <small className="text-muted d-block">Logado como:</small>
            <strong>{user.email}</strong>
          </div>
        </li>
        <li><hr className="dropdown-divider" /></li>
        <li>
          <a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>
            <i className="fas fa-user-cog me-2"></i>
            Perfil
          </a>
        </li>
        <li>
          <a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>
            <i className="fas fa-cog me-2"></i>
            Configurações
          </a>
        </li>
        <li><hr className="dropdown-divider" /></li>
        <li>
          <button
            className="dropdown-item text-danger"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt me-2"></i>
            Sair
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserDropdown; 