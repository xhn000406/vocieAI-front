import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { ColorScheme } from '@/constants/Colors';
import { storage } from '@/utils/storage';
import { getTheme } from '@/constants/Theme';

interface ThemeContextType {
  colorScheme: ColorScheme;
  theme: ReturnType<typeof getTheme>;
  setColorScheme: (scheme: ColorScheme | 'auto') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useRNColorScheme();
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('light');
  const [themePreference, setThemePreference] = useState<'light' | 'dark' | 'auto'>('auto');

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    if (themePreference === 'auto') {
      setColorSchemeState(systemColorScheme === 'dark' ? 'dark' : 'light');
    } else {
      setColorSchemeState(themePreference);
    }
  }, [themePreference, systemColorScheme]);

  const loadTheme = async () => {
    const saved = await storage.getTheme();
    setThemePreference(saved);
  };

  const setColorScheme = async (scheme: ColorScheme | 'auto') => {
    setThemePreference(scheme);
    await storage.setTheme(scheme);
  };

  const theme = getTheme(colorScheme);

  return (
    <ThemeContext.Provider value={{ colorScheme, theme, setColorScheme }}>
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

