import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { CatalogRequestError } from '@/lib/catalog-types';
import { CatalogClient } from '@/components/CatalogClient';
import { getCategories, getProducts } from '@/lib/catalog-api';
import { parseCatalogFilters } from '@/lib/catalog-filters';
import type { ProductPage, CatalogCategory } from '@/lib/catalog-types';

type Search = Record<string, string | string[] | undefined>;

export async function generateMetadata() {
  const t = await getTranslations('Catalog');
  return { title: t('title'), description: t('metaDescription') };
}

export default async function ProductsPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Search>;
}) {
  const { locale } = await params;
  const search = await searchParams;
  const filters = parseCatalogFilters(search);
  const t = await getTranslations('Catalog');

  let page: ProductPage;
  let categories: CatalogCategory[];
  try {
    [page, categories] = await Promise.all([getProducts(filters), getCategories()]);
  } catch (error) {
    const message = error instanceof CatalogRequestError && error.status === 400 ? t('invalidFilters') : t('errorMessage');
    return <main className="catalog-shell"><h1>{t('title')}</h1><section className="catalog-state" role="alert"><h2>{t('errorTitle')}</h2><p>{message}</p><Link href="/products">{t('retry')}</Link></section></main>;
  }
  return <CatalogClient key={JSON.stringify({ filters, ids: page.content.map((product) => product.id) })} initialPage={page} categories={categories} initialFilters={filters} />;
}
