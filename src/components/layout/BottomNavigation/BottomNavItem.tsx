import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BottomNavItemProps {
  path: string;
  icon: string;
  label: string;
}

const BottomNavItem: React.FC<BottomNavItemProps> = ({ path, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`bottom-nav-item ${isActive ? 'active' : ''}`}
    >
      <i className={icon}></i>
      <span>{label}</span>
    </Link>
  );
};

export default BottomNavItem; 