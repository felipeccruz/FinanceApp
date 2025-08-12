import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import UserDropdown from './UserDropdown';

interface MenuItemType {
  path: string;
  icon: string;
  label: string;
}

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems: MenuItemType[] = [
    { path: '/', icon: 'fas fa-home', label: 'Dashboard' },
    { path: '/transactions', icon: 'fas fa-exchange-alt', label: 'Transações' },
    { path: '/reports', icon: 'fas fa-chart-bar', label: 'Relatórios' },
    { path: '/goals', icon: 'fas fa-bullseye', label: 'Metas' }
  ];

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="fas fa-chart-line me-2" style={{ color: '#667eea' }}></i>
          FinanceApp
        </Link>

        {user && (
          <>
            {/* Desktop Navigation */}
            <div className="navbar-nav mx-auto d-none d-md-flex flex-row">
              {menuItems.map((item: MenuItemType) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link mx-2 px-3 py-2 rounded ${
                    location.pathname === item.path ? 'active bg-primary text-white' : 'text-dark'
                  }`}
                  style={{ 
                    transition: 'all 0.3s ease',
                    fontWeight: location.pathname === item.path ? '600' : '500'
                  }}
                >
                  <i className={`${item.icon} me-2`}></i>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="navbar-nav ms-auto">
              <UserDropdown />
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 