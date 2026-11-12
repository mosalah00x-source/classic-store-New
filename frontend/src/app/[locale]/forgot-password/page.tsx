import { AuthForm } from '@/components/AuthForm';
import { AuthProvider } from '@/auth/AuthProvider';
export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: 'ar' | 'en' }> }) {
  const { locale } = await params;
  return <main className="auth-shell"><AuthProvider><AuthForm mode="forgot" locale={locale} /></AuthProvider></main>;
}
