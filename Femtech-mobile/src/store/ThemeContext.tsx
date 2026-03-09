// D:\SM-WEB\FEMTECH-AFRICA\Femtech-mobile\src\store\ThemeContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  colors: typeof lightColors;
  setTheme: (theme: ThemeMode) => Promise<void>;
}

const lightColors = {
  primary: '#E91E63',
  background: '#FFF5F8',
  card: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  border: '#F0F0F0',
  white: '#FFFFFF',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
  inputBackground: '#FFFFFF',
};

const darkColors = {
  primary: '#E91E63',
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  border: '#333333',
  white: '#FFFFFF',
  success: '#4CAF50',
  warning: '#FF9800',
  danger: '#F44336',
  inputBackground: '#2A2A2A',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('system');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await SecureStore.getItemAsync('app_theme');
      if (savedTheme) {
        setThemeState(savedTheme as ThemeMode);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    await SecureStore.setItemAsync('app_theme', newTheme);
  };

  const isDark = theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, isDark, colors, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
