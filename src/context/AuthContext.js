import React, { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Verificar se o usuário está logado ao carregar a aplicação
    useEffect(() => {
        const getUser = async () => {
            try {
                const currentUser = await authService.getCurrentUser()
                setUser(currentUser)
            } catch (error) {
                console.error('Erro ao buscar usuário:', error)
            } finally {
                setLoading(false)
            }
        }

        getUser()

        // Escutar mudanças no estado de autenticação
        const { data: { subscription } } = authService.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null)
                setLoading(false)
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    // Função de login
    const signIn = async (email, password) => {
        try {
            setError(null)
            setLoading(true)
            const { user } = await authService.signIn(email, password)
            setUser(user)
            return user
        } catch (error) {
            setError(error.message)
            throw error
        } finally {
            setLoading(false)
        }
    }

    // Função de registro
    const signUp = async (email, password) => {
        try {
            setError(null)
            setLoading(true)
            const { user } = await authService.signUp(email, password)
            return user
        } catch (error) {
            setError(error.message)
            throw error
        } finally {
            setLoading(false)
        }
    }

    // Função de logout
    const signOut = async () => {
        try {
            setError(null)
            await authService.signOut()
            setUser(null)
        } catch (error) {
            setError(error.message)
            throw error
        }
    }

    // Limpar erro
    const clearError = () => setError(null)

    const value = {
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        clearError
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider')
    }
    return context
} 