import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Theme {
  bg: string;
  cardBg: string;
  text: string;
  textMuted: string;
  accent: string;
  accentLight: string;
  border: string;
  scoreBg: string;
  success: string;
  successLight: string;
  danger: string;
  dangerLight: string;
  isDark: boolean;
}

const lightTheme: Theme = {
  bg: '#F0F4F8',
  cardBg: '#FFFFFF',
  text: '#1A1A2E',
  textMuted: '#6B7280',
  accent: '#3B82F6',
  accentLight: '#DBEAFE',
  border: 'rgba(0,0,0,0.1)',
  scoreBg: '#1A1A2E',
  success: '#10B981',
  successLight: '#D1FAE5',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  isDark: false,
};

const darkTheme: Theme = {
  bg: '#0F172A',
  cardBg: '#1E293B',
  text: '#F1F5F9',
  textMuted: '#94A3B8',
  accent: '#60A5FA',
  accentLight: '#1E3A5F',
  border: 'rgba(255,255,255,0.08)',
  scoreBg: '#020617',
  success: '#34D399',
  successLight: '#064E3B',
  danger: '#F87171',
  dangerLight: '#450A0A',
  isDark: true,
};

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ theme: isDark ? darkTheme : lightTheme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
