import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LocaleSwitcher } from '@/components/LocaleSwitcher';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { SuccessState } from '@/components/SuccessState';
import type { Locale } from '@/i18n/direction';

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('HomePage');
  return (
    <main className="page-shell">
      <header className="topbar"><span className="brand-mark">CS</span><span className="brand-name">Classic Store</span><LocaleSwitcher /><nav className="auth-nav"><a href={`/${locale}/login`}>{locale === 'ar' ? 'دخول' : 'Sign in'}</a><a href={`/${locale}/register`}>{locale === 'ar' ? 'إنشاء حساب' : 'Register'}</a></nav></header>
      <section className="hero">
        <p className="eyebrow">CLASSIC STORE · FOUNDATION</p>
        <h1>{t('title')}</h1><p className="hero-copy">{t('subtitle')}</p>
      </section>
      <section className="states-grid" aria-label="Shared UI states">
        <LoadingState title={t('loadingTitle')} message={t('loadingMessage')} />
        <EmptyState title={t('emptyTitle')} message={t('emptyMessage')} />
        <ErrorState locale={locale} title={t('errorTitle')} messageAr="حدث خطأ أثناء تحميل المحتوى." messageEn="Something went wrong while loading the content." />
        <SuccessState title={t('successTitle')} message={t('successMessage')} />
      </section>
      <footer>© {new Date().getFullYear()} Classic Store</footer>
    </main>
  );
}