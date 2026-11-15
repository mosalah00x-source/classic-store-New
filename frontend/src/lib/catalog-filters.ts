import type { CatalogFilters, ProductSummary } from './catalog-types';

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function validMoney(value?: string): number | undefined {
  if (!value || !/^\d+(\.\d{1,2})?$/.test(value)) return undefined;
  const amount = Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : undefined;
}

export function parseCatalogFilters(search: SearchParams): CatalogFilters {
  const min = validMoney(first(search.minPrice));
  const max = validMoney(first(search.maxPrice));
  const rangeValid = min === undefined || max === undefined || min <= max;
  const sort = first(search.sort);
  return {
    q: first(search.q)?.trim().slice(0, 100) || undefined,
    categoryId: first(search.categoryId) || undefined,
    minPrice: rangeValid && min !== undefined ? min.toFixed(2) : undefined,
    maxPrice: rangeValid && max !== undefined ? max.toFixed(2) : undefined,
    sort: sort === 'priceAsc' || sort === 'priceDesc' ? sort : 'newest',
    page: 0,
    size: 20
  };
}

export function mergeProductItems(current: ProductSummary[], incoming: ProductSummary[]): ProductSummary[] {
  const seen = new Set(current.map((product) => product.id));
  const uniqueIncoming = incoming.filter((product) => {
    if (seen.has(product.id)) return false;
    seen.add(product.id);
    return true;
  });
  return [...current, ...uniqueIncoming];
}
