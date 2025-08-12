import React from 'react'
import { Link } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'

function GoalsWidget() {
    const { goals } = useFinance()

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const getProgressPercentage = (current, target) => {
        return Math.min(100, (current / target) * 100)
    }

    // Show active goals (not completed) first, then completed ones, limit to 4
    const displayGoals = goals
        .filter(goal => !goal.archived) // Only show non-archived goals
        .sort((a, b) => {
            const progressA = getProgressPercentage(a.current_amount, a.target_amount)
            const progressB = getProgressPercentage(b.current_amount, b.target_amount)
            const completedA = progressA >= 100
            const completedB = progressB >= 100

            // Active goals first, then by progress descending
            if (completedA !== completedB) {
                return completedA - completedB
            }
            return progressB - progressA
        })
        .slice(0, 4)

    const activeGoals = goals.filter(goal => !goal.archived)

    if (activeGoals.length === 0) {
        return (
            <div className="text-center text-muted py-4">
                <i className="fas fa-bullseye fa-2x mb-3 d-block"></i>
                <p className="mb-2">Nenhuma meta definida</p>
                <Link to="/goals" className="btn btn-sm btn-primary">
                    <i className="fas fa-plus me-1"></i>
                    Criar Meta
                </Link>
            </div>
        )
    }

    return (
        <div>
            {displayGoals.map((goal) => {
                const progress = getProgressPercentage(goal.current_amount, goal.target_amount)
                const isCompleted = progress >= 100

                return (
                    <div key={goal.id} className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <div className="fw-semibold text-truncate" style={{ maxWidth: '60%' }}>
                                {goal.title}
                            </div>
                            <small className={`fw-bold ${isCompleted ? 'text-success' : 'text-primary'}`}>
                                {progress.toFixed(0)}%
                                {isCompleted && <i className="fas fa-check-circle ms-1"></i>}
                            </small>
                        </div>
                        <div className="progress mb-1" style={{ height: '6px' }}>
                            <div
                                className={`progress-bar ${isCompleted ? 'bg-success' : 'bg-primary'}`}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="d-flex justify-content-between">
                            <small className="text-muted">
                                {formatCurrency(Number(goal.current_amount))}
                            </small>
                            <small className="text-muted">
                                {formatCurrency(Number(goal.target_amount))}
                            </small>
                        </div>
                    </div>
                )
            })}

            {activeGoals.length > 4 && (
                <div className="text-center mt-3">
                    <small className="text-muted">
                        +{activeGoals.length - 4} metas adicionais
                    </small>
                </div>
            )}

            <div className="text-center mt-3">
                <Link to="/goals" className="btn btn-sm btn-outline-primary">
                    <i className="fas fa-bullseye me-1"></i>
                    Ver Todas as Metas
                </Link>
            </div>
        </div>
    )
}

export default GoalsWidget 