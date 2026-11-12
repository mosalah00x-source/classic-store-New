'use client';

import { useState, type FormEvent } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link, useRouter } from '@/i18n/navigation';
import { ApiRequestError, authApi } from '@/lib/api-client';

export default function ResetPasswordPage() {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const params = useSearchParams();
  const token = params.get('token') ?? '';
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError(''); setSuccess('');
    try {
      await authApi.resetPassword(token, password);
      setSuccess(isAr ? 'تم تغيير كلمة المرور. يمكنك تسجيل الدخول.' : 'Password changed. You can sign in.');
      router.push('/login');
    } catch (cause) {
      setError(cause instanceof ApiRequestError ? cause.message : (isAr ? 'تعذر تغيير كلمة المرور.' : 'Could not reset password.'));
    } finally { setBusy(false); }
  }

  return <main className="auth-shell"><section className="auth-card">
    <Link href="/" className="auth-brand">Classic Store</Link>
    <p className="eyebrow">CLASSIC STORE · ACCOUNT</p>
    <h1>{isAr ? 'تعيين كلمة مرور جديدة' : 'Set a new password'}</h1>
    {!token && <p className="auth-error">{isAr ? 'رابط الاستعادة غير مكتمل.' : 'The reset link is incomplete.'}</p>}
    <form className="auth-form" onSubmit={submit}>
      <label>{isAr ? 'كلمة المرور الجديدة' : 'New password'}<input type="password" minLength={10} maxLength={72} required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      {error && <p className="auth-error" role="alert">{error}</p>}
      {success && <p className="auth-success" role="status">{success}</p>}
      <button type="submit" disabled={busy || !token}>{busy ? (isAr ? 'جارٍ التنفيذ...' : 'Please wait...') : (isAr ? 'حفظ كلمة المرور' : 'Save password')}</button>
    </form>
  </section></main>;
}
