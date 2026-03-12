'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { User, AuthState, LoginCredentials, RegisterData, AuthResponse } from '@/types';

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
    });
    const router = useRouter();

    // Check for existing session on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await apiClient.get<{ user: User }>('/auth/me');
                    setState({
                        user: response.user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    setState({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,
                    });
                }
            } else {
                setState(prev => ({ ...prev, isLoading: false }));
            }
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const response = await apiClient.post<AuthResponse>('/auth/login', credentials);

            localStorage.setItem('token', response.token);
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
            }

            setState({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            if (response.user.role === 'government') {
                router.push('/dashboard/government');
            } else {
                router.push('/dashboard');
            }
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.message || 'Login failed',
            }));
            throw error;
        }
    };

    const register = async (data: RegisterData) => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const response = await apiClient.post<AuthResponse>('/auth/register', data);

            localStorage.setItem('token', response.token);
            if (response.refreshToken) {
                localStorage.setItem('refreshToken', response.refreshToken);
            }

            setState({
                user: response.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });

            if (response.user.role === 'government') {
                router.push('/dashboard/government');
            } else {
                router.push('/dashboard');
            }
        } catch (error: any) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.message || 'Registration failed',
            }));
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
        });
        router.push('/login');
    };

    const refreshUser = async () => {
        try {
            const response = await apiClient.get<{ user: User }>('/auth/me');
            setState(prev => ({ ...prev, user: response.user }));
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
