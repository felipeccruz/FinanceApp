import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import {
    Auth,
    MainLayout,
    DashboardPage,
    TransactionsPage,
    ReportsPage,
    GoalsPage
} from './components';

// Loading spinner component
const LoadingSpinner: React.FC = () => {
    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center">
            <div className="text-center">
                <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <h5 className="text-white">Carregando FinanceApp...</h5>
            </div>
        </div>
    );
};

// Main app component (only shown when user is logged in)
const MainApp: React.FC = () => {
    return (
        <FinanceProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="transactions" element={<TransactionsPage />} />
                        <Route path="reports" element={<ReportsPage />} />
                        <Route path="goals" element={<GoalsPage />} />
                    </Route>
                </Routes>
            </Router>
        </FinanceProvider>
    );
};

// Component that decides which screen to show
const AppContent: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <Auth />;
    }

    return <MainApp />;
};

// Root application component
const App: React.FC = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App; 