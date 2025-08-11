import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
    const location = useLocation();

    const menuItems = [
        { path: '/', icon: 'fas fa-home', label: 'Dashboard' },
        { path: '/transactions', icon: 'fas fa-exchange-alt', label: 'Transações' },
        { path: '/reports', icon: 'fas fa-chart-bar', label: 'Relatórios' },
        { path: '/goals', icon: 'fas fa-bullseye', label: 'Metas' }
    ];

    return (
        <div className="sidebar p-3 mt-3">
            <h6 className="text-center mb-4 text-white-50">MENU</h6>
            <nav className="nav flex-column">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <i className={`${item.icon} me-3`}></i>
                        {item.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}

export default Sidebar; 