'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

const STORAGE_KEY = 'classic-store:bottom-nav:v1';
type NavigationItem = { id: 'home' | 'products' | 'product' | 'cart' | 'checkout' | 'done'; href?: '/' | '/products'; enabled: boolean };
const items: NavigationItem[] = [
  { id: 'home', href: '/', enabled: true },
  { id: 'products', href: '/products', enabled: true },
  { id: 'product', enabled: false },
  { id: 'cart', enabled: false },
  { id: 'checkout', enabled: false },
  { id: 'done', enabled: false }
];

export function StorefrontBottomNav() {
  const t = useTranslations('BottomNav');
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'collapsed') setExpanded(false);
      if (stored !== 'collapsed' && stored !== 'expanded' && stored !== null) window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      setExpanded(true);
    }
  }, []);

  function toggleExpanded() {
    setExpanded((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? 'expanded' : 'collapsed');
      } catch {
        // Keep the preference in memory for this page view when storage is unavailable.
      }
      return next;
    });
  }

  return (
    <nav className="storefront-bottom-nav" aria-label={t('navigation')}>
      <button className="storefront-bottom-nav-toggle" type="button" aria-expanded={expanded}
        aria-label={expanded ? t('collapse') : t('expand')} onClick={toggleExpanded}>
        <span aria-hidden="true">{expanded ? '⌄' : '⌃'}</span>
      </button>
      <ul className="storefront-bottom-nav-list" hidden={!expanded}>
        {items.map((item) => {
          const label = t(item.id);
          if (!item.enabled || !item.href) return (
            <li key={item.id}>
              <span className="storefront-bottom-nav-item is-disabled" aria-disabled="true" tabIndex={-1}>
                <span>{label}</span><small>{t('comingSoon')}</small>
              </span>
            </li>
          );
          const active = item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return <li key={item.id}><Link className="storefront-bottom-nav-item" href={item.href} aria-current={active ? 'page' : undefined}>{label}</Link></li>;
        })}
      </ul>
    </nav>
  );
}
