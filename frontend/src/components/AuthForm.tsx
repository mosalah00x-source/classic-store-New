'use client';
import { useState, type FormEvent } from 'react';
import { ApiError, identityApi } from '@/lib/api';
import { useAuth } from '@/auth/AuthProvider';
type Props = { mode: 'login' | 'register' | 'forgot' | 'reset'; locale: 'ar' | 'en'; resetToken?: string };
const copy = {
  ar: {
    login:'تسجيل الدخول', register:'إنشاء حساب', forgot:'استعادة كلمة المرور', reset:'تعيين كلمة مرور جديدة',
    identifier:'البريد الإلكتروني أو الهاتف', email:'البريد الإلكتروني', phone:'رقم الهاتف (اختياري)', first:'الاسم الأول', last:'اسم العائلة',
    password:'كلمة المرور', newPassword:'كلمة المرور الجديدة', currentPassword:'كلمة المرور الحالية',
    submit:'متابعة', working:'جارٍ التنفيذ…', success:'تم تنفيذ الطلب بنجاح.', forgotHint:'إذا كان الحساب موجودًا، فستُرسل تعليمات الاستعادة.',
    generic:'تعذر تنفيذ الطلب. حاول مرة أخرى.', back:'العودة لتسجيل الدخول'
  },
  en: {
    login:'Sign in', register:'Create account', forgot:'Recover password', reset:'Set a new password',
    identifier:'Email or phone', email:'Email', phone:'Phone (optional)', first:'First name', last:'Last name',
    password:'Password', newPassword:'New password', currentPassword:'Current password',
    submit:'Continue', working:'Working…', success:'The request completed successfully.', forgotHint:'If the account exists, reset instructions will be sent.',
    generic:'The request could not be completed. Please try again.', back:'Back to sign in'
  }
};
export function AuthForm({ mode, locale, resetToken }: Props) {
  const t = copy[locale];
  const { login, register, busy } = useAuth();
  const [values, setValues] = useState({ identifier:'', email:'', phone:'', firstName:'', lastName:'', password:'', newPassword:'' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [working, setWorking] = useState(false);
  const update = (key: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) => setValues(v => ({ ...v, [key]: event.target.value }));
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setMessage(''); setWorking(true);
    try {
      if (mode === 'login') await login(values.identifier, values.password);
      if (mode === 'register') await register({ email: values.email || undefined, phone: values.phone || undefined, password: values.password, firstName: values.firstName, lastName: values.lastName });
      if (mode === 'forgot') { await identityApi.forgotPassword(values.email); setMessage(t.forgotHint); }
      if (mode === 'reset') { if (!resetToken) throw new Error('Missing reset token'); await identityApi.resetPassword(resetToken, values.newPassword); setMessage(t.success); }
    } catch (cause) {
      const apiError = cause instanceof ApiError ? cause : null;
      const localized = locale === 'ar' ? apiError?.body.messageAr : apiError?.body.messageEn;
      setError(localized || (cause instanceof Error && cause.message !== 'Missing reset token' ? cause.message : t.generic));
    } finally { setWorking(false); }
  }
  const title = t[mode];
  return <section className="auth-card">
    <h1>{title}</h1>
    <form onSubmit={submit}>
      {mode === 'login' && <><label>{t.identifier}<input autoComplete="username" required value={values.identifier} onChange={update('identifier')} /></label><label>{t.password}<input type="password" autoComplete="current-password" required value={values.password} onChange={update('password')} /></label></>}
      {mode === 'register' && <><label>{t.first}<input required maxLength={100} value={values.firstName} onChange={update('firstName')} /></label><label>{t.last}<input required maxLength={100} value={values.lastName} onChange={update('lastName')} /></label><label>{t.email}<input type="email" value={values.email} onChange={update('email')} /></label><label>{t.phone}<input type="tel" value={values.phone} onChange={update('phone')} /></label><label>{t.password}<input type="password" minLength={10} maxLength={72} autoComplete="new-password" required value={values.password} onChange={update('password')} /></label></>}
      {mode === 'forgot' && <label>{t.email}<input type="email" required value={values.email} onChange={update('email')} /></label>}
      {mode === 'reset' && <label>{t.newPassword}<input type="password" minLength={10} maxLength={72} autoComplete="new-password" required value={values.newPassword} onChange={update('newPassword')} /></label>}
      {error && <p className="auth-error" role="alert">{error}</p>}
      {message && <p className="auth-success" role="status">{message}</p>}
      <button type="submit" disabled={working || busy}>{working || busy ? t.working : t.submit}</button>
    </form>
  </section>;
}
