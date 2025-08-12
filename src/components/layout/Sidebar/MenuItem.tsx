import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MenuItemProps {
  path: string;
  icon: string;
  label: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ path, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`nav-link ${isActive ? 'active' : ''}`}
    >
      <i className={`${icon} me-3`}></i>
      {label}
    </Link>
  );
};

export default MenuItem; 