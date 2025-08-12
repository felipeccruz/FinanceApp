import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function MobileSidebar({ isOpen, onClose }) {
    const location = useLocation()
    const { user, signOut } = useAuth()

    const menuItems = [
        { path: '/', icon: 'fas fa-home', label: 'Dashboard' },
        { path: '/transactions', icon: 'fas fa-exchange-alt', label: 'Transações' },
        { path: '/reports', icon: 'fas fa-chart-bar', label: 'Relatórios' },
        { path: '/goals', icon: 'fas fa-bullseye', label: 'Metas' }
    ]

    const handleLogout = async () => {
        try {
            await signOut()
            onClose()
        } catch (error) {
            console.error('Erro ao fazer logout:', error)
        }
    }

    const handleLinkClick = () => {
        onClose()
    }

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
                {user && (
                    <div className="mb-4 p-3 rounded" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <div className="d-flex align-items-center">
                            <div className="me-3 p-2 rounded-circle bg-white text-primary d-flex align-items-center justify-content-center"
                                style={{ width: '40px', height: '40px' }}>
                                <i className="fas fa-user"></i>
                            </div>
                            <div>
                                <div className="fw-semibold">{user.email?.split('@')[0] || 'Usuário'}</div>
                                <small className="opacity-75">{user.email}</small>
                            </div>
                        </div>
                    </div>
                )}

                {/* Menu Items */}
                <nav className="nav flex-column">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link d-flex align-items-center py-3 ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={handleLinkClick}
                        >
                            <i className={`${item.icon} me-3`} style={{ width: '20px' }}></i>
                            {item.label}
                        </Link>
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
    )
}

export default MobileSidebar 