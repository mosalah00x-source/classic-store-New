import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LoadingState } from '@/components/LoadingState';
import { HomeStorefront } from '@/components/HomeStorefront';
import type { Locale } from '@/i18n/direction';
import { getCategories, getProducts } from '@/lib/catalog-api';

type PageProps = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  return { title: t('metadataTitle'), description: t('metadataDescription') };
}

async function HomeContent({ locale }: { locale: Locale }) {
  const [categoriesResult, productsResult] = await Promise.allSettled([
    getCategories(),
    getProducts({ sort: 'newest', page: 0, size: 8 })
  ]);

  return (
    <HomeStorefront
      locale={locale}
      categories={categoriesResult.status === 'fulfilled' ? categoriesResult.value : []}
      products={productsResult.status === 'fulfilled' ? productsResult.value.content : []}
      categoriesError={categoriesResult.status === 'rejected'}
      productsError={productsResult.status === 'rejected'}
    />
  );
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  return (
    <Suspense fallback={
      <main className="home-shell">
        <LoadingState title={t('loadingTitle')} message={t('loadingMessage')} />
      </main>
    }>
      <HomeContent locale={locale} />
    </Suspense>
  );
}
