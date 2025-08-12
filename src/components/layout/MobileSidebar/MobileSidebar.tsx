import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import MobileMenuItem from './MobileMenuItem';
import UserProfile from './UserProfile';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItemType {
  path: string;
  icon: string;
  label: string;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  const { signOut } = useAuth();

  const menuItems: MenuItemType[] = [
    { path: '/', icon: 'fas fa-home', label: 'Dashboard' },
    { path: '/transactions', icon: 'fas fa-exchange-alt', label: 'Transações' },
    { path: '/reports', icon: 'fas fa-chart-bar', label: 'Relatórios' },
    { path: '/goals', icon: 'fas fa-bullseye', label: 'Metas' }
  ];

  const handleLogout = async (): Promise<void> => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleLinkClick = (): void => {
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
        onClick={onClose}
      />

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${isOpen ? 'show' : ''}`}>
        <div className="mobile-sidebar-header">
          <div>
            <h6 className="mb-0 fw-bold">
              <i className="fas fa-chart-line me-2"></i>
              FinanceApp
            </h6>
          </div>
          <button
            className="mobile-sidebar-close"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* User Info */}
        <UserProfile />

        {/* Menu Items */}
        <nav className="nav flex-column">
          {menuItems.map((item: MenuItemType) => (
            <MobileMenuItem
              key={item.path}
              path={item.path}
              icon={item.icon}
              label={item.label}
              onClick={handleLinkClick}
            />
          ))}
        </nav>

        {/* Divider */}
        <hr className="my-4 opacity-25" />

        {/* Actions */}
        <nav className="nav flex-column">
          <a
            href="#"
            className="nav-link d-flex align-items-center py-3"
            onClick={(e) => e.preventDefault()}
          >
            <i className="fas fa-user-cog me-3" style={{ width: '20px' }}></i>
            Perfil
          </a>
          <a
            href="#"
            className="nav-link d-flex align-items-center py-3"
            onClick={(e) => e.preventDefault()}
          >
            <i className="fas fa-cog me-3" style={{ width: '20px' }}></i>
            Configurações
          </a>
          <button
            className="nav-link d-flex align-items-center py-3 text-danger border-0 bg-transparent w-100 text-start"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt me-3" style={{ width: '20px' }}></i>
            Sair
          </button>
        </nav>
      </div>
    </>
  );
};

export default MobileSidebar; 