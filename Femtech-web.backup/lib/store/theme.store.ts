// lib/store/theme.store.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  isDark: boolean;
  
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'system' as Theme,
      isDark: false,
      
      setTheme: (theme) =>
        set((state) => ({
          theme,
          isDark:
            theme === 'dark' ||
            (theme === 'system' &&
              typeof window !== 'undefined' &&
              window.matchMedia('(prefers-color-scheme: dark)').matches),
        })),
      
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
          isDark: !state.isDark,
        })),
    }),
    {
      name: 'theme-store',
    }
  )
);
