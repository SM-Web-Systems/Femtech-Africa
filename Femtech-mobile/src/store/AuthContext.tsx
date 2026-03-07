import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '../constants';
import { authApi, User } from '../api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        const { data } = await authApi.getCurrentUser();
        setState({ user: data, token, isLoading: false, isAuthenticated: true });
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = async (token: string, user: User) => {
    await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
    setState({ user, token, isLoading: false, isAuthenticated: true });
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.SECRET_KEY);
    setState({ user: null, token: null, isLoading: false, isAuthenticated: false });
  };

  const refreshUser = async () => {
    try {
      const { data } = await authApi.getCurrentUser();
      setState(prev => ({ ...prev, user: data }));
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
