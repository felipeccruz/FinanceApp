import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { FinanceProvider } from './context/FinanceContext'
import Auth from './components/Auth'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Transactions from './components/Transactions'
import Reports from './components/Reports'
import Goals from './components/Goals'
import TransactionForm from './components/TransactionForm'

// Componente para mostrar loading
function LoadingSpinner() {
    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <h5 className="text-white">Carregando FinanceApp...</h5>
            </div>
        </div>
    )
}

// Componente principal do app (só é exibido quando usuário está logado)
function MainApp() {
    const [showModal, setShowModal] = useState(false)

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handleOpenModal = () => {
        setShowModal(true)
    }

    return (
        <FinanceProvider>
            <Router>
                <div className="main-container">
                    <Navbar />
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-3 col-lg-2">
                                <Sidebar />
                            </div>
                            <div className="col-md-9 col-lg-10">
                                <div className="p-4">
                                    <Routes>
                                        <Route path="/" element={<Dashboard />} />
                                        <Route path="/transactions" element={<Transactions />} />
                                        <Route path="/reports" element={<Reports />} />
                                        <Route path="/goals" element={<Goals />} />
                                    </Routes>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botão Flutuante Global - FORA do main-container */}
                <button
                    className="floating-btn"
                    onClick={handleOpenModal}
                    aria-label="Nova Transação"
                >
                    <i className="fas fa-plus me-2"></i>
                    Nova Transação
                </button>

                {/* Modal para Nova Transação */}
                {showModal && (
                    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        <i className="fas fa-plus-circle me-2"></i>
                                        Nova Transação
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={handleCloseModal}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <TransactionForm onClose={handleCloseModal} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Router>
        </FinanceProvider>
    )
}

// Componente que decide qual tela mostrar
function AppContent() {
    const { user, loading } = useAuth()

    if (loading) {
        return <LoadingSpinner />
    }

    if (!user) {
        return <Auth />
    }

    return <MainApp />
}

// Componente raiz da aplicação
function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    )
}

export default App 