import React, { createContext, useContext, ReactNode } from 'react';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../constants';

interface Theme {
  colors: typeof COLORS;
  fonts: typeof FONTS;
  spacing: typeof SPACING;
  radius: typeof RADIUS;
  shadows: typeof SHADOWS;
}

const theme: Theme = {
  colors: COLORS,
  fonts: FONTS,
  spacing: SPACING,
  radius: RADIUS,
  shadows: SHADOWS,
};

const ThemeContext = createContext<Theme>(theme);

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
