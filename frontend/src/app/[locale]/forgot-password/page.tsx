import { AuthForm } from '@/components/AuthForm';
export default async function ForgotPasswordPage({ params }: { params: Promise<{ locale: 'ar' | 'en' }> }) {
  const { locale } = await params;
  return <main className="auth-shell"><AuthForm mode="forgot" locale={locale} /></main>;
}