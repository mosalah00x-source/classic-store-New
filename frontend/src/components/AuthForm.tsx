'use client';

import { useState, type FormEvent } from 'react';
import { useLocale } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { ApiRequestError, authApi } from '@/lib/api-client';

type Mode = 'login' | 'register' | 'forgot';
type Props = { mode: Mode };

export function AuthForm({ mode }: Props) {
  const locale = useLocale();
  const router = useRouter();
  const isAr = locale === 'ar';
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const copy = {
    login: isAr ? 'تسجيل الدخول' : 'Sign in',
    register: isAr ? 'إنشاء حساب' : 'Create account',
    forgot: isAr ? 'استعادة كلمة المرور' : 'Reset password',
    identifier: isAr ? 'البريد الإلكتروني أو رقم الهاتف' : 'Email or phone',
    email: isAr ? 'البريد الإلكتروني' : 'Email',
    phone: isAr ? 'رقم الهاتف' : 'Phone',
    firstName: isAr ? 'الاسم الأول' : 'First name',
    lastName: isAr ? 'اسم العائلة' : 'Last name',
    password: isAr ? 'كلمة المرور (10 أحرف على الأقل)' : 'Password (at least 10 characters)',
    submit: isAr ? 'متابعة' : 'Continue',
    working: isAr ? 'جارٍ التنفيذ...' : 'Please wait...',
    loginSuccess: isAr ? 'تم تسجيل الدخول بنجاح.' : 'Signed in successfully.',
    registerSuccess: isAr ? 'تم إنشاء الحساب. يمكنك تسجيل الدخول الآن.' : 'Account created. You can sign in now.',
    forgotSuccess: isAr ? 'إذا كان الحساب موجودًا، فستصل تعليمات الاستعادة إلى البريد الإلكتروني.' : 'If the account exists, reset instructions will be sent.',
    genericError: isAr ? 'تعذر تنفيذ الطلب. حاول مرة أخرى.' : 'The request could not be completed. Try again.'
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      if (mode === 'login') {
        await authApi.login({ identifier, password });
        setMessage(copy.loginSuccess);
        router.replace('/');
        router.refresh();
      } else if (mode === 'register') {
        await authApi.register({
          ...(email.trim() ? { email: email.trim() } : {}),
          ...(phone.trim() ? { phone: phone.trim() } : {}),
          password,
          firstName: firstName.trim(),
          lastName: lastName.trim()
        });
        setMessage(copy.registerSuccess);
        router.push('/login');
      } else {
        await authApi.forgotPassword(email.trim());
        setMessage(copy.forgotSuccess);
      }
    } catch (cause) {
      setError(cause instanceof ApiRequestError ? cause.message : copy.genericError);
    } finally {
      setBusy(false);
    }
  }

  const title = copy[mode];
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <Link href="/" className="auth-brand">Classic Store</Link>
        <p className="eyebrow">CLASSIC STORE · ACCOUNT</p>
        <h1>{title}</h1>
        <form onSubmit={submit} className="auth-form">
          {mode === 'login' && <label>{copy.identifier}<input autoComplete="username" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} /></label>}
          {mode === 'register' && <>
            <label>{copy.firstName}<input autoComplete="given-name" required maxLength={100} value={firstName} onChange={(e) => setFirstName(e.target.value)} /></label>
            <label>{copy.lastName}<input autoComplete="family-name" required maxLength={100} value={lastName} onChange={(e) => setLastName(e.target.value)} /></label>
            <label>{copy.email}<input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label>{copy.phone}<input type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
            <p className="auth-hint">{isAr ? 'أدخل البريد الإلكتروني أو رقم الهاتف على الأقل.' : 'Provide at least an email address or phone number.'}</p>
          </>}
          {mode === 'forgot' && <label>{copy.email}<input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>}
          {mode !== 'forgot' && <label>{copy.password}<input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={10} maxLength={72} required value={password} onChange={(e) => setPassword(e.target.value)} /></label>}
          {error && <p className="auth-error" role="alert">{error}</p>}
          {message && <p className="auth-success" role="status">{message}</p>}
          <button type="submit" disabled={busy}>{busy ? copy.working : copy.submit}</button>
        </form>
        <nav className="auth-links">
          {mode !== 'login' && <Link href="/login">{isAr ? 'تسجيل الدخول' : 'Sign in'}</Link>}
          {mode !== 'register' && <Link href="/register">{isAr ? 'إنشاء حساب' : 'Create account'}</Link>}
          {mode !== 'forgot' && <Link href="/forgot-password">{isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?'}</Link>}
        </nav>
      </section>
    </main>
  );
}
