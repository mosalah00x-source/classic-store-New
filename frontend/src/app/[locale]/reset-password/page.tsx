import { AuthForm } from '@/components/AuthForm';
import { AuthProvider } from '@/auth/AuthProvider';
export default async function ResetPasswordPage({ params, searchParams }: { params: Promise<{ locale: 'ar' | 'en' }>; searchParams: Promise<{ token?: string }> }) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  return <main className="auth-shell"><AuthProvider><AuthForm mode="reset" locale={locale} resetToken={query.token} /></AuthProvider></main>;
}
