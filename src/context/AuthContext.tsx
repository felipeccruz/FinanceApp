import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Check if user is logged in when app loads
    useEffect(() => {
        const getUser = async (): Promise<void> => {
            try {
                const currentUser = await authService.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
            } finally {
                setLoading(false);
            }
        };

        getUser();

        // Listen for auth state changes
        const { data: { subscription } } = authService.onAuthStateChange(
            async (event: any, session: any) => {
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Sign in function
    const signIn = async (email: string, password: string): Promise<any> => {
        try {
            setError(null);
            setLoading(true);
            const { user } = await authService.signIn(email, password);
            setUser(user);
            return user;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Sign up function
    const signUp = async (email: string, password: string): Promise<any> => {
        try {
            setError(null);
            setLoading(true);
            const { user } = await authService.signUp(email, password);
            return user;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Sign out function
    const signOut = async (): Promise<void> => {
        try {
            setError(null);
            await authService.signOut();
            setUser(null);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            setError(errorMessage);
            throw error;
        }
    };

    // Clear error function
    const clearError = (): void => setError(null);

    const value: AuthContextType = {
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}; 