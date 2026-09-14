import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { colors } from '../config/colors';
import { borderRadius, spacing, typography, shadows } from '../config/theme';

export interface Theme {
  colors: typeof colors;
  borderRadius: typeof borderRadius;
  spacing: typeof spacing;
  typography: typeof typography;
  shadows: typeof shadows;
}

const ThemeContext = createContext<Theme | null>(null);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const theme = useMemo(() => ({
    colors,
    borderRadius,
    spacing,
    typography,
    shadows,
  }), []);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): Theme => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
