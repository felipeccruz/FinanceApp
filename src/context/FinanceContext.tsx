import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { transactionService, goalService, categoryService } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Transaction, Goal, Category, FinanceContextType } from '../types';

// State interface
interface FinanceState {
    transactions: Transaction[];
    categories: Category[];
    goals: Goal[];
    loading: boolean;
    error: string | null;
}

// Action types
type FinanceAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
    | { type: 'ADD_TRANSACTION'; payload: Transaction }
    | { type: 'DELETE_TRANSACTION'; payload: string }
    | { type: 'SET_GOALS'; payload: Goal[] }
    | { type: 'ADD_GOAL'; payload: Goal }
    | { type: 'UPDATE_GOAL'; payload: Goal }
    | { type: 'DELETE_GOAL'; payload: string }
    | { type: 'SET_CATEGORIES'; payload: Category[] };

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const initialState: FinanceState = {
    transactions: [],
    categories: [],
    goals: [],
    loading: false,
    error: null
};

function financeReducer(state: FinanceState, action: FinanceAction): FinanceState {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, loading: action.payload };

        case 'SET_ERROR':
            return { ...state, error: action.payload, loading: false };

        case 'SET_TRANSACTIONS':
            return { ...state, transactions: action.payload, loading: false };

        case 'ADD_TRANSACTION':
            return {
                ...state,
                transactions: [action.payload, ...state.transactions],
                loading: false
            };

        case 'DELETE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.filter(t => t.id !== action.payload),
                loading: false
            };

        case 'SET_GOALS':
            return { ...state, goals: action.payload, loading: false };

        case 'ADD_GOAL':
            return {
                ...state,
                goals: [action.payload, ...state.goals],
                loading: false
            };

        case 'UPDATE_GOAL':
            return {
                ...state,
                goals: state.goals.map(goal =>
                    goal.id === action.payload.id ? action.payload : goal
                ),
                loading: false
            };

        case 'DELETE_GOAL':
            return {
                ...state,
                goals: state.goals.filter(g => g.id !== action.payload),
                loading: false
            };

        case 'SET_CATEGORIES':
            return { ...state, categories: action.payload, loading: false };

        default:
            return state;
    }
}

interface FinanceProviderProps {
    children: ReactNode;
}

export const FinanceProvider: React.FC<FinanceProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(financeReducer, initialState);
    const { user } = useAuth();

    // Load data when user logs in
    useEffect(() => {
        if (user) {
            loadData();
        } else {
            // Clear data when logout
            dispatch({ type: 'SET_TRANSACTIONS', payload: [] });
            dispatch({ type: 'SET_GOALS', payload: [] });
            dispatch({ type: 'SET_CATEGORIES', payload: [] });
        }
    }, [user]);

    // Function to load all data
    const loadData = async (): Promise<void> => {
        if (!user) return;

        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            // Load data in parallel
            const [transactions, goals, categories] = await Promise.all([
                transactionService.getTransactions(user.id),
                goalService.getGoals(user.id),
                categoryService.getCategories()
            ]);

            dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
            dispatch({ type: 'SET_GOALS', payload: goals });
            dispatch({ type: 'SET_CATEGORIES', payload: categories });
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
        }
    };

    // Transaction functions
    const addTransaction = async (transactionData: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<void> => {
        if (!user) return;

        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            const transaction = await transactionService.addTransaction({
                ...transactionData,
                user_id: user.id
            });

            dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
        } catch (error) {
            console.error('Erro ao adicionar transação:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
        }
    };

    const deleteTransaction = async (id: string): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            await transactionService.deleteTransaction(id);
            dispatch({ type: 'DELETE_TRANSACTION', payload: id });
        } catch (error) {
            console.error('Erro ao deletar transação:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
        }
    };

    // Goal functions
    const addGoal = async (goalData: Omit<Goal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<void> => {
        if (!user) return;

        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            const goal = await goalService.addGoal({
                ...goalData,
                user_id: user.id
            });

            dispatch({ type: 'ADD_GOAL', payload: goal });
        } catch (error) {
            console.error('Erro ao adicionar meta:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
        }
    };

    const updateGoal = async (id: string, updates: Partial<Goal>): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            const goal = await goalService.updateGoal(id, updates);
            dispatch({ type: 'UPDATE_GOAL', payload: goal });
        } catch (error) {
            console.error('Erro ao atualizar meta:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
        }
    };

    const deleteGoal = async (id: string): Promise<void> => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });

            await goalService.deleteGoal(id);
            dispatch({ type: 'DELETE_GOAL', payload: id });
        } catch (error) {
            console.error('Erro ao deletar meta:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            dispatch({ type: 'SET_ERROR', payload: errorMessage });
        }
    };

    // Calculation functions (maintained from original code)
    const getBalance = (): number => {
        return state.transactions.reduce((total, transaction) => {
            return transaction.type === 'income' ? total + Number(transaction.amount) : total - Number(transaction.amount);
        }, 0);
    };

    const getIncome = (): number => {
        return state.transactions
            .filter(t => t.type === 'income')
            .reduce((total, t) => total + Number(t.amount), 0);
    };

    const getExpenses = (): number => {
        return state.transactions
            .filter(t => t.type === 'expense')
            .reduce((total, t) => total + Number(t.amount), 0);
    };

    const getTransactionsByCategory = (): Record<string, number> => {
        const categoryData: Record<string, number> = {};
        state.transactions.forEach(transaction => {
            if (!categoryData[transaction.category]) {
                categoryData[transaction.category] = 0;
            }
            if (transaction.type === 'expense') {
                categoryData[transaction.category] += Number(transaction.amount);
            }
        });
        return categoryData;
    };

    // Clear error
    const clearError = (): void => dispatch({ type: 'SET_ERROR', payload: null });

    const value: FinanceContextType = {
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
    };

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );
};

export const useFinance = (): FinanceContextType => {
    const context = useContext(FinanceContext);
    if (!context) {
        throw new Error('useFinance deve ser usado dentro de um FinanceProvider');
    }
    return context;
}; 