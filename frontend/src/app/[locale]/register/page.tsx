import { AuthForm } from '@/components/AuthForm';
export default async function RegisterPage({ params }: { params: Promise<{ locale: 'ar' | 'en' }> }) {
  const { locale } = await params;
  return <main className="auth-shell"><AuthForm mode="register" locale={locale} /></main>;
}