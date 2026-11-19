'use client';

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import { readThemePreference, writeThemePreference, type ThemePreference } from '@/lib/theme-preference';

type ThemeContextValue = { theme: ThemePreference; toggleTheme: () => void };
const ThemeContext = createContext<ThemeContextValue | null>(null);
const listeners = new Set<() => void>();

function notifyThemeChange() {
  listeners.forEach((listener) => listener());
}

function subscribeToThemeChanges(listener: () => void) {
  listeners.add(listener);

  function handleStorage(event: StorageEvent) {
    if (event.key !== 'classic-store-theme' && event.key !== null) return;
    const theme = readThemePreference();
    document.documentElement.setAttribute('data-theme', theme);
    notifyThemeChange();
  }

  window.addEventListener('storage', handleStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', handleStorage);
  };
}

function getThemeSnapshot(): ThemePreference {
  return readThemePreference();
}

function getServerThemeSnapshot(): ThemePreference {
  return 'light';
}

export function StorefrontThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeToThemeChanges, getThemeSnapshot, getServerThemeSnapshot);

  const toggleTheme = useCallback(() => {
    const next: ThemePreference = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    writeThemePreference(next);
    notifyThemeChange();
  }, [theme]);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useStorefrontTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useStorefrontTheme must be used within StorefrontThemeProvider');
  return value;
}
