import React from 'react';
import MenuItem from './MenuItem';

interface MenuItemType {
  path: string;
  icon: string;
  label: string;
}

const Sidebar: React.FC = () => {
  const menuItems: MenuItemType[] = [
    { path: '/', icon: 'fas fa-home', label: 'Dashboard' },
    { path: '/transactions', icon: 'fas fa-exchange-alt', label: 'Transações' },
    { path: '/reports', icon: 'fas fa-chart-bar', label: 'Relatórios' },
    { path: '/goals', icon: 'fas fa-bullseye', label: 'Metas' }
  ];

  return (
    <div className="sidebar p-3 mt-3">
      <h6 className="text-center mb-4 text-white-50">MENU</h6>
      <nav className="nav flex-column">
        {menuItems.map((item: MenuItemType) => (
          <MenuItem
            key={item.path}
            path={item.path}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>
    </div>
  );
};

export default Sidebar; 