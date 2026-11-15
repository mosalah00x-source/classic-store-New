'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { CatalogCategory, CatalogFilters, ProductPage, ProductSummary } from '@/lib/catalog-types';

type Props = { initialPage: ProductPage; categories: CatalogCategory[]; initialFilters: CatalogFilters };

type CategoryNode = CatalogCategory & { children: CategoryNode[] };

function categoryTree(items: CatalogCategory[]): CategoryNode[] {
  const nodes = new Map(items.map((item) => [item.id, { ...item, children: [] as CategoryNode[] }]));
  const roots: CategoryNode[] = [];
  for (const item of items) {
    const node = nodes.get(item.id);
    if (!node) continue;
    const parent = item.parentId ? nodes.get(item.parentId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }
  return roots;
}

function flattenCategories(items: CategoryNode[]): CatalogCategory[] {
  return items.flatMap(({ children, ...item }) => [item, ...flattenCategories(children)]);
}

export function CatalogClient({ initialPage, categories, initialFilters }: Props) {
  const t = useTranslations('Catalog');
  const router = useRouter();
  const [page, setPage] = useState(initialPage);
  const [items, setItems] = useState(initialPage.content);
  const [filters, setFilters] = useState(initialFilters);
  const [query, setQuery] = useState(initialFilters.q ?? '');
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice ?? '');
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const tree = useMemo(() => categoryTree(categories), [categories]);
  const flatCategories = useMemo(() => flattenCategories(tree), [tree]);
  const hasMore = page.page + 1 < page.totalPages;

  useEffect(() => {
    setPage(initialPage);
    setItems(initialPage.content);
    setFilters(initialFilters);
    setQuery(initialFilters.q ?? '');
    setMinPrice(initialFilters.minPrice ?? '');
    setMaxPrice(initialFilters.maxPrice ?? '');
  }, [initialPage, initialFilters]);

  useEffect(() => {
    if (!drawerOpen) return;
    const root = drawerRef.current;
    const focusable = () => root?.querySelectorAll<HTMLElement>('button, input, select, a[href], [tabindex]:not([tabindex="-1"])') ?? [];
    focusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
      if (event.key === 'Tab') {
        const elements = Array.from(focusable());
        if (!elements.length) return;
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen]);

  function apply(next: CatalogFilters) {
    const params = new URLSearchParams();
    if (next.q) params.set('q', next.q);
    if (next.categoryId) params.set('categoryId', next.categoryId);
    if (next.minPrice) params.set('minPrice', next.minPrice);
    if (next.maxPrice) params.set('maxPrice', next.maxPrice);
    if (next.sort && next.sort !== 'newest') params.set('sort', next.sort);
    const suffix = params.toString();
    setDrawerOpen(false);
    router.push(suffix ? `/ar/products?${suffix}` : '/ar/products');
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const min = minPrice.trim() ? Number(minPrice) : undefined;
    const max = maxPrice.trim() ? Number(maxPrice) : undefined;
    if ((min !== undefined && (!Number.isFinite(min) || min < 0)) ||
        (max !== undefined && (!Number.isFinite(max) || max < 0)) ||
        (min !== undefined && max !== undefined && min > max)) {
      setError(t('invalidFilters'));
      return;
    }
    setError('');
    apply({ ...filters, q: query.trim() || undefined, minPrice: min === undefined ? undefined : min.toFixed(2), maxPrice: max === undefined ? undefined : max.toFixed(2), page: 0 });
  }

  async function loadMore() {
    if (!hasMore || loading) return;
    setLoading(true);
    setError('');
    const params = new URLSearchParams();
    Object.entries({ ...filters, page: page.page + 1, size: page.size }).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.set(key, String(value));
    });
    try {
      const response = await fetch(`/api/catalog/products?${params.toString()}`, { headers: { Accept: 'application/json' } });
      const payload = await response.json();
      if (!response.ok) {
        setError(response.status === 400 ? t('invalidFilters') : t('errorMessage'));
        return;
      }
      const next = payload as ProductPage;
      setItems((current) => {
        const seen = new Set(current.map((product) => product.id));
        return [...current, ...next.content.filter((product) => !seen.has(product.id))];
      });
      setPage(next);
    } catch {
      setError(t('errorMessage'));
    } finally {
      setLoading(false);
    }
  }

  function removeFilter(key: keyof CatalogFilters) {
    const next = { ...filters, [key]: undefined, page: 0 };
    if (key === 'q') setQuery('');
    if (key === 'minPrice') setMinPrice('');
    if (key === 'maxPrice') setMaxPrice('');
    apply(next);
  }

  function filterFields() {
    return <form className="catalog-filter-form" onSubmit={submit}>
      <label>{t('search')}<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('searchPlaceholder')} /></label>
      <label>{t('category')}<select value={filters.categoryId ?? ''} onChange={(event) => setFilters((current) => ({ ...current, categoryId: event.target.value || undefined }))}><option value="">{t('allCategories')}</option>{flatCategories.map((category) => <option key={category.id} value={category.id}>{category.nameAr}</option>)}</select></label>
      <div className="catalog-price-fields"><label>{t('minPrice')}<input inputMode="decimal" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} /></label><label>{t('maxPrice')}<input inputMode="decimal" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} /></label></div>
      <label>{t('sort')}<select value={filters.sort ?? 'newest'} onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value as CatalogFilters['sort'] }))}><option value="newest">{t('newest')}</option><option value="priceAsc">{t('priceAsc')}</option><option value="priceDesc">{t('priceDesc')}</option></select></label>
      <button className="catalog-primary-button" type="submit">{t('apply')}</button>
    </form>;
  }

  return <main className="catalog-shell">
    <header className="catalog-heading"><div><p className="catalog-eyebrow">CLASSIC STORE</p><h1>{t('title')}</h1><p>{t('subtitle')}</p></div><button className="catalog-mobile-filter" type="button" onClick={() => setDrawerOpen(true)}>{t('filters')}</button></header>
    <div className="catalog-layout">
      <aside className="catalog-sidebar"><h2>{t('filters')}</h2>{filterFields()}</aside>
      <section className="catalog-results" aria-live="polite">
        <div className="catalog-toolbar"><span>{t('resultCount', { count: page.totalElements })}</span><div className="catalog-chips">
          {filters.q && <button type="button" onClick={() => removeFilter('q')}>{filters.q} ×</button>}
          {filters.categoryId && <button type="button" onClick={() => removeFilter('categoryId')}>{flatCategories.find((item) => item.id === filters.categoryId)?.nameAr ?? t('category')} ×</button>}
          {filters.minPrice && <button type="button" onClick={() => removeFilter('minPrice')}>{t('minPrice')}: {filters.minPrice} ×</button>}
          {filters.maxPrice && <button type="button" onClick={() => removeFilter('maxPrice')}>{t('maxPrice')}: {filters.maxPrice} ×</button>}
          {(filters.q || filters.categoryId || filters.minPrice || filters.maxPrice || filters.sort !== 'newest') && <button type="button" onClick={() => { setQuery(''); setMinPrice(''); setMaxPrice(''); setFilters({ sort: 'newest', page: 0, size: 20 }); apply({ sort: 'newest' }); }}>{t('clearAll')}</button>}
        </div></div>
        {error && <p className="catalog-error" role="alert">{error} <button type="button" onClick={() => { setError(''); router.refresh(); }}>{t('retry')}</button></p>}
        {items.length === 0 ? <div className="catalog-state"><h2>{t('emptyTitle')}</h2><p>{t('emptyMessage')}</p></div> :
          <div className="catalog-grid">{items.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
        {hasMore && <button className="catalog-load-more" type="button" disabled={loading} onClick={loadMore}>{loading ? t('loading') : t('loadMore')}</button>}
      </section>
    </div>
    {drawerOpen && <div className="catalog-drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDrawerOpen(false); }}>
      <aside className="catalog-drawer" role="dialog" aria-modal="true" aria-labelledby="catalog-drawer-title" ref={drawerRef}>
        <div className="catalog-drawer-heading"><h2 id="catalog-drawer-title">{t('filters')}</h2><button type="button" onClick={() => setDrawerOpen(false)} aria-label={t('close')}>×</button></div>
        {filterFields()}
      </aside>
    </div>}
  </main>;
}

function ProductCard({ product }: { product: ProductSummary }) {
  const t = useTranslations('Catalog');
  return <article className="catalog-card">
    <a className="catalog-card-link" href={`/ar/products/${encodeURIComponent(product.slug)}`} aria-label={product.nameAr}>
      <div className="catalog-card-image">{product.primaryImage ? <img src={product.primaryImage.imageUrl} alt={product.primaryImage.altAr || product.nameAr} loading="lazy" /> : <span aria-hidden="true">{t('imagePlaceholder')}</span>}</div>
      <div className="catalog-card-copy"><h2>{product.nameAr}</h2>{product.brand?.name ? <p className="catalog-brand">{product.brand.name}</p> : null}<p className="catalog-price">{product.priceFrom === null ? t('unavailable') : t('priceFrom', { price: product.priceFrom })}</p></div>
    </a>
  </article>;
}
