'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readThemePreference, writeThemePreference, type ThemePreference } from '@/lib/theme-preference';

type ThemeContextValue = { theme: ThemePreference; toggleTheme: () => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function StorefrontThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemePreference>('light');

  useEffect(() => {
    const stored = readThemePreference();
    setTheme(stored);
    document.documentElement.setAttribute('data-theme', stored);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: ThemePreference = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      writeThemePreference(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useStorefrontTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useStorefrontTheme must be used within StorefrontThemeProvider');
  return value;
}
