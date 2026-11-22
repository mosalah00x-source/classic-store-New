import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Cairo, Inter } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { getDirection } from '@/i18n/direction';
import { getCategories } from '@/lib/catalog-api';
import { StorefrontThemeProvider } from '@/components/StorefrontThemeProvider';
import { StorefrontHeader } from '@/components/StorefrontHeader';
import { StorefrontFooter } from '@/components/StorefrontFooter';
import '../globals.css';

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-arabic', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-latin', display: 'swap' });


export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const categories = await getCategories().catch(() => []);

  return (
    <html lang={locale} dir={getDirection(locale)} data-theme="light" suppressHydrationWarning className={`${cairo.variable} ${inter.variable}`}>
      <Script id="classic-store-theme-init" src="/classic-store-theme-init.js" strategy="beforeInteractive" />
      <body>
        <NextIntlClientProvider messages={messages}>
          <StorefrontThemeProvider>
            <StorefrontHeader categories={categories} />
            {children}
            <StorefrontFooter />
          </StorefrontThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
