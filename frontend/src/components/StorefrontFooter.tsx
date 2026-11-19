'use client';

import { useLocale, useTranslations } from 'next-intl';
import { BrandLogo } from '@/components/BrandLogo';
import { Link } from '@/i18n/navigation';

export function StorefrontFooter() {
  const locale = useLocale();
  const t = useTranslations('Storefront');

  return (
    <footer className="storefront-footer">
      <div className="storefront-footer-inner">
        <div className="storefront-footer-brand">
          <BrandLogo locale={locale} footer />
          <p>{t('footerDescription')}</p>
        </div>
        <nav aria-label={t('footerNavigation')}>
          <Link href="/">{t('home')}</Link>
          <Link href="/products">{t('allProducts')}</Link>
          <Link href="/login">{t('login')}</Link>
          <Link href="/register">{t('createAccount')}</Link>
        </nav>
        <div className="storefront-footer-contact">
          <strong>{t('contact')}</strong>
          <span>{t('contactComingSoon')}</span>
        </div>
      </div>
      <p className="storefront-copyright">© {new Date().getFullYear()} Classic Store</p>
    </footer>
  );
}
