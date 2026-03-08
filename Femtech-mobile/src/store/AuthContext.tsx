import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

interface User {
  id: string;
  phone: string;
  country: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  hasAccount: boolean;
  biometricAvailable: boolean;
  biometricType: string;
  storedPhone: string | null;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  eraseProfile: () => Promise<void>;
  loginWithBiometric: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('Biometric');
  const [storedPhone, setStoredPhone] = useState<string | null>(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check biometric hardware
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      setBiometricAvailable(compatible && enrolled);

      // Get biometric type
      if (compatible) {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Fingerprint');
        }
      }

      // Check if account exists
      const userData = await SecureStore.getItemAsync('user_data');
      const token = await SecureStore.getItemAsync('auth_token');
      
      if (userData && token) {
        const parsedUser = JSON.parse(userData);
        setStoredPhone(parsedUser.phone);
        setHasAccount(true);
        // Don't auto-login - require biometric
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData: User, token: string) => {
    await SecureStore.setItemAsync('auth_token', String(token));
    await SecureStore.setItemAsync('user_data', JSON.stringify(userData));
    setStoredPhone(userData.phone);
    setHasAccount(true);
    setIsLoggedIn(true);
    setUser(userData);
  };

  // Logout = disconnect session but keep account
  const logout = async () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  // Erase profile = delete everything
  const eraseProfile = async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user_data');
    setStoredPhone(null);
    setHasAccount(false);
    setIsLoggedIn(false);
    setUser(null);
  };

  const loginWithBiometric = async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login to MamaTokens',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        const userData = await SecureStore.getItemAsync('user_data');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setIsLoggedIn(true);
          setUser(parsedUser);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Biometric login failed:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isLoggedIn,
      hasAccount,
      biometricAvailable,
      biometricType,
      storedPhone,
      login,
      logout,
      eraseProfile,
      loginWithBiometric,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
