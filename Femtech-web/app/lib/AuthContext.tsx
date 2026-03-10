'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, CurrentUserResponse } from './authApi';

interface AuthContextType {
    user: CurrentUserResponse | null;
    isLoading: boolean;
    isInitialized: boolean;
    isAuthenticated: boolean;
    error: string | null;
    login: (phone: string, country: string) => Promise<void>;
    verifyOtp: (phone: string, otp: string) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<CurrentUserResponse | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // check if use is already logged in when app loads
    useEffect(() => {
        const checkAuth = async () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
            if (token) {
                try {
                    setIsLoading(true);
                    const currentUser = await authApi.getCurrentUser();
                    setUser(currentUser);
                    setIsAuthenticated(true);
                } catch (err) {
                    localStorage.removeItem('auth_token');
                    setIsAuthenticated(false);
                    setUser(null);
                    console.log("Auth check failed:", err);
                } finally {
                    setIsLoading(false);
                    setIsInitialized(true);
                }
            }
        }

        checkAuth();
    }, []);

    const login = async (phone: string, country: string) => {
        try {
            setIsLoading(true);
            setError(null);
            await authApi.requestOtp(phone, country);
            // OTP sent successfully, user will verify next
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while requesting OTP';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    const verifyOtp = async (phone: string, otp: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await authApi.verifyOtp(phone, otp);

            if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', response.token);

                // Set user and authenticated state
                setUser(response.users as CurrentUserResponse);
                setIsAuthenticated(true);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred while verifying OTP';
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }

    const logout = () => {
        authApi.logOut();
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
    }

    const clearError = () => {
        setError(null);
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoading,
            isInitialized,
            error,
            login,
            verifyOtp,
            logout,
            clearError,
        }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context == undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}