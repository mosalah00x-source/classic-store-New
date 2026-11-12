import { AccountPanel } from '@/components/AccountPanel';
export default async function AccountPage({ params }: { params: Promise<{ locale: 'ar' | 'en' }> }) {
  const { locale } = await params;
  return <main className="auth-shell"><AccountPanel locale={locale} /></main>;
}