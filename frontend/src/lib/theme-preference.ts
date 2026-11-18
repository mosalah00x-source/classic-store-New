export type ThemePreference = 'light' | 'dark';
type ThemeStorage = Pick<Storage, 'getItem' | 'setItem'>;
const THEME_STORAGE_KEY = 'classic-store-theme';

function getBrowserStorage(): ThemeStorage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function readThemePreference(storage: ThemeStorage | null = getBrowserStorage()): ThemePreference {
  try {
    return storage?.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function writeThemePreference(theme: ThemePreference, storage: ThemeStorage | null = getBrowserStorage()): void {
  try {
    storage?.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be disabled; the in-memory theme still works for this page view.
  }
}
