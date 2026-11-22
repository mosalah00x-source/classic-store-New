import { getTranslations, setRequestLocale } from 'next-intl/server';
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
    </main>
  );
}