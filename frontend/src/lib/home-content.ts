import type { Locale } from '../i18n/direction';
import type { CatalogCategory, ProductSummary } from './catalog-types';

export function getHomeCategoryName(category: CatalogCategory, locale: Locale, englishFallback: string): string {
  return locale === 'ar' ? category.nameAr : category.nameEn?.trim() || englishFallback;
}

export function getHomeProductName(product: ProductSummary, locale: Locale, englishFallback: string): string {
  return locale === 'ar' ? product.nameAr : product.nameEn?.trim() || englishFallback;
}
