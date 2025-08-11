import React from 'react'
import { useAuth } from '../context/AuthContext'

function Navbar() {
    const { user, signOut } = useAuth()

    const handleLogout = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error('Erro ao fazer logout:', error)
        }
    }

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">
                <a className="navbar-brand fw-bold" href="/">
                    <i className="fas fa-chart-line me-2" style={{ color: '#667eea' }}></i>
                    FinanceApp
                </a>

                {user && (
                    <div className="navbar-nav ms-auto">
                        <div className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle d-flex align-items-center"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                            >
                                <div className="me-2 p-1 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                    style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                                    <i className="fas fa-user"></i>
                                </div>
                                <div className="d-flex flex-column align-items-start">
                                    <small className="text-muted mb-0" style={{ fontSize: '11px' }}>Olá,</small>
                                    <span className="fw-semibold" style={{ fontSize: '13px', lineHeight: '1' }}>
                                        {user.email?.split('@')[0] || 'Usuário'}
                                    </span>
                                </div>
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <div className="dropdown-item-text">
                                        <small className="text-muted d-block">Logado como:</small>
                                        <strong>{user.email}</strong>
                                    </div>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>
                                        <i className="fas fa-user-cog me-2"></i>
                                        Perfil
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>
                                        <i className="fas fa-cog me-2"></i>
                                        Configurações
                                    </a>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button
                                        className="dropdown-item text-danger"
                                        onClick={handleLogout}
                                    >
                                        <i className="fas fa-sign-out-alt me-2"></i>
                                        Sair
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar 