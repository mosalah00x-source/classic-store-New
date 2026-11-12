import { AuthForm } from '@/components/AuthForm';
import { AuthProvider } from '@/auth/AuthProvider';
export default async function LoginPage({ params }: { params: Promise<{ locale: 'ar' | 'en' }> }) {
  const { locale } = await params;
  return <main className="auth-shell"><AuthProvider><AuthForm mode="login" locale={locale} /></AuthProvider></main>;
}
