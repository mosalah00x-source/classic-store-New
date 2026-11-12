'use client';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { identityApi, setSession, type User } from '@/lib/api';
type AuthContextValue = {
  user: User | null;
  busy: boolean;
  login(identifier: string, password: string): Promise<void>;
  register(input: { email?: string; phone?: string; password: string; firstName: string; lastName: string }): Promise<void>;
  logout(): Promise<void>;
  reloadProfile(): Promise<void>;
};
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [busy, setBusy] = useState(false);
  const reloadProfile = useCallback(async () => { setUser(await identityApi.me()); }, []);
  const login = useCallback(async (identifier: string, password: string) => {
    setBusy(true);
    try { setSession(await identityApi.login(identifier, password)); await reloadProfile(); }
    catch (error) { setSession(null); setUser(null); throw error; }
    finally { setBusy(false); }
  }, [reloadProfile]);
  const register = useCallback(async (input: { email?: string; phone?: string; password: string; firstName: string; lastName: string }) => {
    setBusy(true);
    try { await identityApi.register(input); await login(input.email ?? input.phone ?? '', input.password); }
    finally { setBusy(false); }
  }, [login]);
  const logout = useCallback(async () => {
    setBusy(true);
    try { await identityApi.logout(); }
    finally { setSession(null); setUser(null); setBusy(false); }
  }, []);
  const value = useMemo(() => ({ user, busy, login, register, logout, reloadProfile }), [user, busy, login, register, logout, reloadProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}
