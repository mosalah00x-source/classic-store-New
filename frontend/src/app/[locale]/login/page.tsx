import { AuthForm } from '@/components/AuthForm';
export default async function LoginPage({ params }: { params: Promise<{ locale: 'ar' | 'en' }> }) {
  const { locale } = await params;
  return <main className="auth-shell"><AuthForm mode="login" locale={locale} /></main>;
}