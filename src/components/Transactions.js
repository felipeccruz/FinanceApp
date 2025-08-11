import React from 'react'
import TransactionList from './TransactionList'

function Transactions() {
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">
                    <i className="fas fa-exchange-alt me-2" style={{ color: '#667eea' }}></i>
                    Transações
                </h2>
                <span className="text-muted">Gerencie todas as suas transações</span>
            </div>

            <div className="card">
                <div className="card-header bg-white">
                    <h5 className="card-title mb-0">
                        <i className="fas fa-list me-2"></i>
                        Histórico de Transações
                    </h5>
                </div>
                <div className="card-body">
                    <TransactionList />
                </div>
            </div>
        </div>
    )
}

export default Transactions 