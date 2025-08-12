import React from 'react';
import BottomNavItem from './BottomNavItem';

interface NavItemType {
  path: string;
  icon: string;
  label: string;
}

const BottomNavigation: React.FC = () => {
  const navItems: NavItemType[] = [
    {
      path: '/',
      icon: 'fas fa-home',
      label: 'Início'
    },
    {
      path: '/transactions',
      icon: 'fas fa-exchange-alt',
      label: 'Transações'
    },
    {
      path: '/reports',
      icon: 'fas fa-chart-bar',
      label: 'Relatórios'
    },
    {
      path: '/goals',
      icon: 'fas fa-bullseye',
      label: 'Metas'
    }
  ];

  return (
    <div className="bottom-nav">
      <div className="bottom-nav-items">
        {navItems.map((item: NavItemType) => (
          <BottomNavItem
            key={item.path}
            path={item.path}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation; 