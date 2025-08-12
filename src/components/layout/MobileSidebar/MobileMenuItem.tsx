import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MobileMenuItemProps {
  path: string;
  icon: string;
  label: string;
  onClick?: () => void;
}

const MobileMenuItem: React.FC<MobileMenuItemProps> = ({ path, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`nav-link d-flex align-items-center py-3 ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <i className={`${icon} me-3`} style={{ width: '20px' }}></i>
      {label}
    </Link>
  );
};

export default MobileMenuItem; 