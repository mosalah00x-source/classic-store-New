import { AuthForm } from '@/components/AuthForm';
export default async function ResetPasswordPage({ params, searchParams }: { params: Promise<{ locale: 'ar' | 'en' }>; searchParams: Promise<{ token?: string }> }) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  return <main className="auth-shell"><AuthForm mode="reset" locale={locale} resetToken={query.token} /></main>;
}