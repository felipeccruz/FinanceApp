import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function BottomNavigation() {
    const location = useLocation()

    const navItems = [
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
    ]

    return (
        <div className="bottom-nav">
            <div className="bottom-nav-items">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                    >
                        <i className={item.icon}></i>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default BottomNavigation 