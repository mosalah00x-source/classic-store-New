import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Cairo, Inter } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { getDirection } from '@/i18n/direction';
import { AuthProvider } from '@/auth/AuthProvider';
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
  return (
    <html lang={locale} dir={getDirection(locale)} className={`${cairo.variable} ${inter.variable}`}>
      <body><NextIntlClientProvider messages={messages}><AuthProvider>{children}</AuthProvider></NextIntlClientProvider></body>
    </html>
  );
}