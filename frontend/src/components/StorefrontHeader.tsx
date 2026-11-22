'use client';

import { useEffect, useRef, useState, type FocusEvent, type FormEvent, type KeyboardEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { BrandLogo } from '@/components/BrandLogo';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import type { CatalogCategory } from '@/lib/catalog-types';
import { useStorefrontTheme } from '@/components/StorefrontThemeProvider';

export function StorefrontHeader({ categories }: { categories: CatalogCategory[] }) {
  const locale = useLocale();
  const t = useTranslations('Storefront');
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useStorefrontTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const categoryTriggerRef = useRef<HTMLButtonElement>(null);
  const focusFirstItemOnOpen = useRef(false);

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !categoryMenuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        categoryTriggerRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    if (focusFirstItemOnOpen.current) {
      categoryMenuRef.current?.querySelector<HTMLAnchorElement>('.storefront-mega-menu a')?.focus();
      focusFirstItemOnOpen.current = false;
    }

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = search.trim();
    router.push(query ? `/products?q=${encodeURIComponent(query)}` : '/products');
    setSearch('');
  }

  function handleCategoryMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!menuOpen || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;

    const links = Array.from(
      categoryMenuRef.current?.querySelectorAll<HTMLAnchorElement>('.storefront-mega-menu a') ?? [],
    );
    if (links.length === 0) return;

    const currentIndex = links.indexOf(document.activeElement as HTMLAnchorElement);
    let nextIndex = currentIndex;

    if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = links.length - 1;
    else if (event.key === 'ArrowDown') nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % links.length;
    else if (event.key === 'ArrowUp') nextIndex = currentIndex < 0 ? links.length - 1 : (currentIndex - 1 + links.length) % links.length;

    event.preventDefault();
    links[nextIndex]?.focus();
  }

  function handleCategoryMenuBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setMenuOpen(false);
    }
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="storefront-header">
      <div className="storefront-header-inner">
        <nav className="storefront-nav" aria-label={t('mainNavigation')}>
          <Link href="/">{t('home')}</Link>
          <div
            className="storefront-category-menu"
            ref={categoryMenuRef}
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => {
              if (!categoryMenuRef.current?.contains(document.activeElement)) setMenuOpen(false);
            }}
            onFocus={() => setMenuOpen(true)}
            onBlur={handleCategoryMenuBlur}
            onKeyDown={handleCategoryMenuKeyDown}
          >
            <button
              ref={categoryTriggerRef}
              type="button"
              aria-expanded={menuOpen}
              aria-controls="storefront-mega-menu"
              aria-haspopup="true"
              onClick={() => setMenuOpen((open) => !open)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  focusFirstItemOnOpen.current = true;
                  setMenuOpen(true);
                }
              }}
            >
              {t('categories')} <span aria-hidden="true">⌄</span>
            </button>
            {menuOpen && (
              <div className="storefront-mega-menu" id="storefront-mega-menu">
                <Link href="/products" onClick={closeMenu}>{t('allCategories')}</Link>
                {categories.map((category) => (
                  <Link key={category.id} href={`/products?categoryId=${encodeURIComponent(category.id)}`} onClick={closeMenu}>
                    {locale === 'ar' ? category.nameAr : category.nameEn || category.nameAr}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/products">{t('newArrivals')}</Link>
        </nav>

        <div className="storefront-logo"><BrandLogo locale={locale} /></div>

        <div className="storefront-tools">
          <form className="storefront-search" role="search" onSubmit={submitSearch}>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('search')} aria-label={t('search')} />
            <button type="submit" aria-label={t('searchSubmit')}>⌕</button>
          </form>
          <Link className="storefront-cart" href="/products" aria-label={t('cart')}>🛒 <span>0</span></Link>
          <button className="storefront-icon-button" type="button" onClick={toggleTheme} aria-pressed={theme === 'dark'} aria-label={theme === 'dark' ? t('lightTheme') : t('darkTheme')}>
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <Link className="storefront-login" href="/login">{t('login')}</Link>
          <Link className="storefront-locale" href={pathname} locale={locale === 'ar' ? 'en' : 'ar'}>{locale === 'ar' ? 'EN' : 'AR'}</Link>
        </div>
      </div>
    </header>
  );
}
