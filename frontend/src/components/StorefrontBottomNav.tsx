'use client';

import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

const STORAGE_KEY = 'classic-store:bottom-nav:v1';
const CHANGE_EVENT = 'classic-store:bottom-nav-change';
let fallbackExpanded = true;

type Item = {
  id: 'home' | 'products' | 'product' | 'cart' | 'checkout' | 'done';
  href?: '/' | '/products';
  enabled: boolean;
};

const items: Item[] = [
  { id: 'home', href: '/', enabled: true },
  { id: 'products', href: '/products', enabled: true },
  { id: 'product', enabled: false },
  { id: 'cart', enabled: false },
  { id: 'checkout', enabled: false },
  { id: 'done', enabled: false },
];

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== 'collapsed';
  } catch {
    return fallbackExpanded;
  }
}

function getServerSnapshot() {
  return true;
}

export function StorefrontBottomNav() {
  const t = useTranslations('BottomNav');
  const pathname = usePathname();
  const expanded = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggleExpanded() {
    const next = !expanded;
    fallbackExpanded = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? 'expanded' : 'collapsed');
    } catch {
      // Keep the preference in memory when storage is unavailable.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return (
    <nav className={`storefront-bottom-nav dn${expanded ? '' : ' min'}`} aria-label={t('navigation')}>
      <button
        className="storefront-bottom-nav-toggle dn-t"
        type="button"
        aria-expanded={expanded}
        aria-label={expanded ? t('collapse') : t('expand')}
        onClick={toggleExpanded}
      >
        <span aria-hidden="true">☰</span>
      </button>
      {items.map((item, index) => {
        const label = t(item.id);
        const active = item.enabled && item.href
          ? item.href === '/' ? pathname === '/' : pathname === item.href || pathname.startsWith(`${item.href}/`)
          : false;

        return (
          <span className="storefront-bottom-nav-entry" key={item.id}>
            {item.enabled && item.href ? (
              <Link className={`storefront-bottom-nav-item${active ? ' active' : ''}`} href={item.href} aria-current={active ? 'page' : undefined}>
                <i aria-hidden="true">{index + 1}</i>{label}
              </Link>
            ) : (
              <span className="storefront-bottom-nav-item is-disabled" aria-disabled="true">
                <i aria-hidden="true">{index + 1}</i>
                <span className="storefront-bottom-nav-label">{label}<small>{t('comingSoon')}</small></span>
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
