'use client';

import { useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { BrandLogo } from '@/components/BrandLogo';
import { Link, useRouter } from '@/i18n/navigation';
import type { CatalogCategory } from '@/lib/catalog-types';
import { useStorefrontTheme } from '@/components/StorefrontThemeProvider';

export function StorefrontHeader({ categories }: { categories: CatalogCategory[] }) {
  const locale = useLocale();
  const t = useTranslations('Storefront');
  const router = useRouter();
  const { theme, toggleTheme } = useStorefrontTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim();
    router.push(query ? `/products?q=${encodeURIComponent(query)}` : '/products');
    setSearch('');
  }

  return (
    <header className="storefront-header">
      <div className="storefront-header-inner">
        <nav className="storefront-nav" aria-label={t('mainNavigation')}>
          <Link href="/">{t('home')}</Link>
          <div className="storefront-category-menu">
            <button type="button" aria-expanded={menuOpen} aria-controls="storefront-mega-menu" onClick={() => setMenuOpen((open) => !open)}>
              {t('categories')} <span aria-hidden="true">⌄</span>
            </button>
            {menuOpen && (
              <div className="storefront-mega-menu" id="storefront-mega-menu">
                <Link href="/products" onClick={() => setMenuOpen(false)}>{t('allCategories')}</Link>
                {categories.map((category) => (
                  <Link key={category.id} href={`/products?categoryId=${encodeURIComponent(category.id)}`} onClick={() => setMenuOpen(false)}>
                    {locale === 'ar' ? category.nameAr : category.nameEn || category.nameAr}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/products">{t('newArrivals')}</Link>
        </nav>

        <Link className="storefront-logo" href="/" aria-label="ClassicStore"><BrandLogo locale={locale} /></Link>

        <div className="storefront-tools">
          <form className="storefront-search" role="search" onSubmit={submitSearch}>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('search')} aria-label={t('search')} />
            <button type="submit" aria-label={t('searchSubmit')}>⌕</button>
          </form>
          <Link className="storefront-cart" href="/products" aria-label={t('cart')}>♧ <span>0</span></Link>
          <button className="storefront-icon-button" type="button" onClick={toggleTheme} aria-pressed={theme === 'dark'} aria-label={theme === 'dark' ? t('lightTheme') : t('darkTheme')}>
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <Link className="storefront-login" href="/login">{t('login')}</Link>
          <Link className="storefront-locale" href="/" locale={locale === 'ar' ? 'en' : 'ar'}>{locale === 'ar' ? 'EN' : 'AR'}</Link>
        </div>
      </div>
    </header>
  );
}
