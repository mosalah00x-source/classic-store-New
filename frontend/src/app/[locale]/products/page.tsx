import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { CatalogClient } from '@/components/CatalogClient';
import { getCategories, getProducts } from '@/lib/catalog-api';
import type { CatalogFilters } from '@/lib/catalog-types';

type Search = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseFilters(search: Search): CatalogFilters {
  const minPrice = first(search.minPrice);
  const maxPrice = first(search.maxPrice);
  const validMoney = (value?: string) => value && /^\d+(\.\d{1,2})?$/.test(value) && Number(value) >= 0;
  const min = validMoney(minPrice) ? Number(minPrice) : undefined;
  const max = validMoney(maxPrice) ? Number(maxPrice) : undefined;
  const rangeValid = min === undefined || max === undefined || min <= max;
  const sortValue = first(search.sort);
  return {
    q: first(search.q)?.trim().slice(0, 100) || undefined,
    categoryId: first(search.categoryId) || undefined,
    minPrice: rangeValid && min !== undefined ? min.toFixed(2) : undefined,
    maxPrice: rangeValid && max !== undefined ? max.toFixed(2) : undefined,
    sort: sortValue === 'priceAsc' || sortValue === 'priceDesc' ? sortValue : 'newest',
    page: 0,
    size: 20
  };
}

export default async function ProductsPage({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Search>;
}) {
  const { locale } = await params;
  if (locale !== 'ar') redirect('/ar/products');
  const search = await searchParams;
  const filters = parseFilters(search);
  const t = await getTranslations('Catalog');

  try {
    const [page, categories] = await Promise.all([getProducts(filters), getCategories()]);
    return <CatalogClient initialPage={page} categories={categories} initialFilters={filters} />;
  } catch {
    return <main className="catalog-shell"><h1>{t('title')}</h1><section className="catalog-state" role="alert"><h2>{t('errorTitle')}</h2><p>{t('errorMessage')}</p><a href="/ar/products">{t('retry')}</a></section></main>;
  }
}
