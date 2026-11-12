'use client';
import { useState } from 'react';
import { useAuth } from '@/auth/AuthProvider';
export function AccountPanel({ locale }: { locale: 'ar' | 'en' }) {
  const { user, busy, logout, reloadProfile } = useAuth();
  const [error, setError] = useState('');
  const ar = locale === 'ar';
  if (!user) return <section className="auth-card"><h1>{ar ? 'الحساب' : 'Account'}</h1><p>{ar ? 'سجّل الدخول لعرض بيانات حسابك.' : 'Sign in to view your account.'}</p><a href={`/${locale}/login`}>{ar ? 'تسجيل الدخول' : 'Sign in'}</a></section>;
  return <section className="auth-card">
    <h1>{ar ? 'حسابي' : 'My account'}</h1>
    <dl className="account-details">
      <dt>{ar ? 'الاسم' : 'Name'}</dt><dd>{user.firstName} {user.lastName}</dd>
      <dt>{ar ? 'البريد الإلكتروني' : 'Email'}</dt><dd>{user.email || '—'}</dd>
      <dt>{ar ? 'الهاتف' : 'Phone'}</dt><dd>{user.phone || '—'}</dd>
      <dt>{ar ? 'الدور' : 'Role'}</dt><dd>{user.role}</dd>
    </dl>
    {error && <p className="auth-error" role="alert">{error}</p>}
    <div className="account-actions">
      <button type="button" disabled={busy} onClick={() => void reloadProfile().catch(() => setError(ar ? 'تعذر تحديث بيانات الحساب.' : 'Could not refresh account details.'))}>{ar ? 'تحديث البيانات' : 'Refresh profile'}</button>
      <button type="button" className="secondary-button" disabled={busy} onClick={() => void logout().catch(() => setError(ar ? 'تعذر تسجيل الخروج من الخادم.' : 'Server logout failed. Local session was cleared.'))}>{ar ? 'تسجيل الخروج' : 'Sign out'}</button>
    </div>
  </section>;
}