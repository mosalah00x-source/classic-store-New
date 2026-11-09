'use client';
import { useLocale } from 'next-intl';
import { usePathname, Link } from '@/i18n/navigation';
export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const target = locale === 'ar' ? 'en' : 'ar';
  return <Link className="locale-switcher" href={pathname} locale={target}>{locale === 'ar' ? 'English' : 'العربية'}</Link>;
}