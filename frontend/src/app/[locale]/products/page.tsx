import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { CatalogClient } from '@/components/CatalogClient';
import { getCategories, getProducts } from '@/lib/catalog-api';
import { parseCatalogFilters } from '@/lib/catalog-filters';

export default async function ProductsPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Search>;
}) {
  const { locale } = await params;
  if (locale !== 'ar') redirect('/ar/products');
  const search = await searchParams;
  const filters = parseCatalogFilters(search);
  const t = await getTranslations('Catalog');

  try {
    const [page, categories] = await Promise.all([getProducts(filters), getCategories()]);
    return <CatalogClient initialPage={page} categories={categories} initialFilters={filters} />;
  } catch {
    return <main className="catalog-shell"><h1>{t('title')}</h1><section className="catalog-state" role="alert"><h2>{t('errorTitle')}</h2><p>{t('errorMessage')}</p><a href="/ar/products">{t('retry')}</a></section></main>;
  }
}
