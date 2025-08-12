import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Transaction, Goal, Category } from '../types';

// Supabase configuration using environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL e Anon Key são necessários. Verifique suas variáveis de ambiente.');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

// Transaction service functions
export const transactionService = {
    // Get all user transactions
    async getTransactions(userId: string): Promise<Transaction[]> {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Add new transaction
    async addTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction> {
        const { data, error } = await supabase
            .from('transactions')
            .insert([transaction])
            .select();

        if (error) throw error;
        return data[0];
    },

    // Delete transaction
    async deleteTransaction(id: string): Promise<void> {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Get transactions by category
    async getTransactionsByCategory(userId: string): Promise<Array<{category: string, amount: number, type: string}>> {
        const { data, error } = await supabase
            .from('transactions')
            .select('category, amount, type')
            .eq('user_id', userId);

        if (error) throw error;
        return data || [];
    }
};

// Goal service functions
export const goalService = {
    // Get all user goals
    async getGoals(userId: string): Promise<Goal[]> {
        const { data, error } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    // Add new goal
    async addGoal(goal: Omit<Goal, 'id' | 'created_at' | 'updated_at'>): Promise<Goal> {
        const { data, error } = await supabase
            .from('goals')
            .insert([goal])
            .select();

        if (error) throw error;
        return data[0];
    },

    // Update goal
    async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
        const { data, error } = await supabase
            .from('goals')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data[0];
    },

    // Delete goal
    async deleteGoal(id: string): Promise<void> {
        const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

// Category service functions
export const categoryService = {
    // Get all categories
    async getCategories(): Promise<Category[]> {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (error) throw error;
        return data || [];
    }
};

// Authentication service functions
export const authService = {
    // Sign in with email and password
    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return data;
    },

    // Sign up
    async signUp(email: string, password: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) throw error;
        return data;
    },

    // Sign out
    async signOut(): Promise<void> {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    // Get current user
    async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    },

    // Listen to auth state changes
    onAuthStateChange(callback: (event: any, session: any) => void) {
        return supabase.auth.onAuthStateChange(callback);
    }
}; 