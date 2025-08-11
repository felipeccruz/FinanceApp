import { createClient } from '@supabase/supabase-js'

// Configurações do Supabase usando variáveis de ambiente
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL e Anon Key são necessários. Verifique suas variáveis de ambiente.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Funções auxiliares para transações
export const transactionService = {
    // Buscar todas as transações do usuário
    async getTransactions(userId) {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false })

        if (error) throw error
        return data
    },

    // Adicionar nova transação
    async addTransaction(transaction) {
        const { data, error } = await supabase
            .from('transactions')
            .insert([transaction])
            .select()

        if (error) throw error
        return data[0]
    },

    // Deletar transação
    async deleteTransaction(id) {
        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    // Buscar transações por categoria
    async getTransactionsByCategory(userId) {
        const { data, error } = await supabase
            .from('transactions')
            .select('category, amount, type')
            .eq('user_id', userId)

        if (error) throw error
        return data
    }
}

// Funções auxiliares para metas
export const goalService = {
    // Buscar todas as metas do usuário
    async getGoals(userId) {
        const { data, error } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    // Adicionar nova meta
    async addGoal(goal) {
        const { data, error } = await supabase
            .from('goals')
            .insert([goal])
            .select()

        if (error) throw error
        return data[0]
    },

    // Atualizar meta
    async updateGoal(id, updates) {
        const { data, error } = await supabase
            .from('goals')
            .update(updates)
            .eq('id', id)
            .select()

        if (error) throw error
        return data[0]
    },

    // Deletar meta
    async deleteGoal(id) {
        const { error } = await supabase
            .from('goals')
            .delete()
            .eq('id', id)

        if (error) throw error
    }
}

// Funções para categorias
export const categoryService = {
    // Buscar todas as categorias
    async getCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name')

        if (error) throw error
        return data
    }
}

// Funções de autenticação
export const authService = {
    // Login com email e senha
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })

        if (error) throw error
        return data
    },

    // Registro
    async signUp(email, password) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        })

        if (error) throw error
        return data
    },

    // Logout
    async signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    },

    // Obter usuário atual
    async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return user
    },

    // Escutar mudanças de autenticação
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback)
    }
} 