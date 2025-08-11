import React, { createContext, useContext, useReducer, useEffect, useState } from 'react'
import { transactionService, goalService, categoryService } from '../lib/supabase'
import { useAuth } from './AuthContext'

const FinanceContext = createContext()

const initialState = {
    transactions: [],
    categories: [],
    goals: [],
    loading: false,
    error: null
}

function financeReducer(state, action) {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload }

        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false }

        case 'SET_TRANSACTIONS':
            return { ...state, transactions: action.payload, loading: false }

        case 'ADD_TRANSACTION':
            return {
                ...state,
                transactions: [action.payload, ...state.transactions],
                loading: false
            }

        case 'DELETE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.filter(t => t.id !== action.payload),
                loading: false
            }

        case 'SET_GOALS':
            return { ...state, goals: action.payload, loading: false }

        case 'ADD_GOAL':
            return {
                ...state,
                goals: [action.payload, ...state.goals],
                loading: false
            }

        case 'UPDATE_GOAL':
            return {
                ...state,
                goals: state.goals.map(goal =>
                    goal.id === action.payload.id ? action.payload : goal
                ),
                loading: false
            }

        case 'DELETE_GOAL':
            return {
                ...state,
                goals: state.goals.filter(g => g.id !== action.payload),
                loading: false
            }

        case 'SET_CATEGORIES':
            return { ...state, categories: action.payload, loading: false }

        default:
            return state
    }
}

export function FinanceProvider({ children }) {
    const [state, dispatch] = useReducer(financeReducer, initialState)
    const { user } = useAuth()

    // Carregar dados quando o usuário logar
    useEffect(() => {
        if (user) {
            loadData()
        } else {
            // Limpar dados quando logout
            dispatch({ type: 'SET_TRANSACTIONS', payload: [] })
            dispatch({ type: 'SET_GOALS', payload: [] })
            dispatch({ type: 'SET_CATEGORIES', payload: [] })
        }
    }, [user])

    // Função para carregar todos os dados
    const loadData = async () => {
        if (!user) return

        try {
            dispatch({ type: 'SET_LOADING', payload: true })

            // Carregar dados em paralelo
            const [transactions, goals, categories] = await Promise.all([
                transactionService.getTransactions(user.id),
                goalService.getGoals(user.id),
                categoryService.getCategories()
            ])

            dispatch({ type: 'SET_TRANSACTIONS', payload: transactions })
            dispatch({ type: 'SET_GOALS', payload: goals })
            dispatch({ type: 'SET_CATEGORIES', payload: categories })
        } catch (error) {
            console.error('Erro ao carregar dados:', error)
            dispatch({ type: 'SET_ERROR', payload: error.message })
        }
    }

    // Funções para transações
    const addTransaction = async (transactionData) => {
        if (!user) return

        try {
            dispatch({ type: 'SET_LOADING', payload: true })

            const transaction = await transactionService.addTransaction({
                ...transactionData,
                user_id: user.id
            })

            dispatch({ type: 'ADD_TRANSACTION', payload: transaction })
        } catch (error) {
            console.error('Erro ao adicionar transação:', error)
            dispatch({ type: 'SET_ERROR', payload: error.message })
        }
    }

    const deleteTransaction = async (id) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true })

            await transactionService.deleteTransaction(id)
            dispatch({ type: 'DELETE_TRANSACTION', payload: id })
        } catch (error) {
            console.error('Erro ao deletar transação:', error)
            dispatch({ type: 'SET_ERROR', payload: error.message })
        }
    }

    // Funções para metas
    const addGoal = async (goalData) => {
        if (!user) return

        try {
            dispatch({ type: 'SET_LOADING', payload: true })

            const goal = await goalService.addGoal({
                ...goalData,
                user_id: user.id
            })

            dispatch({ type: 'ADD_GOAL', payload: goal })
        } catch (error) {
            console.error('Erro ao adicionar meta:', error)
            dispatch({ type: 'SET_ERROR', payload: error.message })
        }
    }

    const updateGoal = async (id, updates) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true })

            const goal = await goalService.updateGoal(id, updates)
            dispatch({ type: 'UPDATE_GOAL', payload: goal })
        } catch (error) {
            console.error('Erro ao atualizar meta:', error)
            dispatch({ type: 'SET_ERROR', payload: error.message })
        }
    }

    const deleteGoal = async (id) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true })

            await goalService.deleteGoal(id)
            dispatch({ type: 'DELETE_GOAL', payload: id })
        } catch (error) {
            console.error('Erro ao deletar meta:', error)
            dispatch({ type: 'SET_ERROR', payload: error.message })
        }
    }

    // Funções de cálculo (mantidas do código original)
    const getBalance = () => {
        return state.transactions.reduce((total, transaction) => {
            return transaction.type === 'income' ? total + Number(transaction.amount) : total - Number(transaction.amount)
        }, 0)
    }

    const getIncome = () => {
        return state.transactions
            .filter(t => t.type === 'income')
            .reduce((total, t) => total + Number(t.amount), 0)
    }

    const getExpenses = () => {
        return state.transactions
            .filter(t => t.type === 'expense')
            .reduce((total, t) => total + Number(t.amount), 0)
    }

    const getTransactionsByCategory = () => {
        const categoryData = {}
        state.transactions.forEach(transaction => {
            if (!categoryData[transaction.category]) {
                categoryData[transaction.category] = 0
            }
            if (transaction.type === 'expense') {
                categoryData[transaction.category] += Number(transaction.amount)
            }
        })
        return categoryData
    }

    // Limpar erro
    const clearError = () => dispatch({ type: 'SET_ERROR', payload: null })

    const value = {
        ...state,
        addTransaction,
        deleteTransaction,
        addGoal,
        updateGoal,
        deleteGoal,
        getBalance,
        getIncome,
        getExpenses,
        getTransactionsByCategory,
        clearError,
        refreshData: loadData
    }

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    )
}

export function useFinance() {
    const context = useContext(FinanceContext)
    if (!context) {
        throw new Error('useFinance deve ser usado dentro de um FinanceProvider')
    }
    return context
} 