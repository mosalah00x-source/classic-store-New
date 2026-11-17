'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { readThemePreference, writeThemePreference, type ThemePreference } from '@/lib/theme-preference';
import Link from 'next/link';
import type { ProductDetail } from '@/lib/product-detail-api';
import { onProductImageError, PRODUCT_IMAGE_PLACEHOLDER } from '@/lib/product-image';
import { formatPrice } from '@/lib/price-format';

export function ProductDetailClient({ product }: { product: ProductDetail }) {
  const t = useTranslations('ProductTheme');
  const [theme, setTheme] = useState<ThemePreference>('light');

  useEffect(() => {
    const storedTheme = readThemePreference();
    setTheme(storedTheme);
    document.documentElement.setAttribute('data-theme', storedTheme);
  }, []);

  function toggleTheme() {
    const nextTheme: ThemePreference = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    writeThemePreference(nextTheme);
  }
  const [selectedVariantId, setSelectedVariantId] = useState(product.variants[0]?.id ?? '');
  const [selectedImageId, setSelectedImageId] = useState(product.images[0]?.id ?? '');
  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId) ?? product.variants[0];
  const selectedImage = product.images.find((image) => image.id === selectedImageId) ?? product.images[0];
  const gallery = useMemo(
    () => [...product.images].sort((a, b) => a.sortOrder - b.sortOrder),
    [product.images]
  );

  return (
    <main className="product-detail-shell">
      <div className="product-detail-top-actions">
        <button type="button" className="product-theme-toggle" aria-pressed={theme === 'dark'} onClick={toggleTheme}>
          {theme === 'dark' ? t('switchToLight') : t('switchToDark')}
        </button>
      </div>
      <nav className="product-breadcrumb" aria-label="مسار التنقل">
        <Link href="/ar/products">الرئيسية</Link>
        <span aria-hidden="true">&gt;</span>
        <Link href="/ar/products">جميع المنتجات</Link>
        <span aria-hidden="true">&gt;</span>
        <span aria-current="page">{product.nameAr}</span>
      </nav>

      <div className="product-detail-grid">
        <section className="product-gallery" aria-label="صور المنتج">
          <div className="product-gallery-main">
            {selectedImage ? (
              <img
                src={selectedImage.imageUrl || PRODUCT_IMAGE_PLACEHOLDER}
                alt={selectedImage.altAr || product.nameAr}
                onError={(event) => onProductImageError(event, product.nameAr)}
              />
            ) : (
              <div className="product-gallery-empty" role="img" aria-label="لا توجد صورة للمنتج">لا توجد صورة</div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="product-gallery-thumbnails" aria-label="اختر صورة">
              {gallery.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  className={image.id === selectedImage?.id ? 'is-selected' : ''}
                  aria-label={image.altAr || `الصورة ${index + 1}`}
                  aria-pressed={image.id === selectedImage?.id}
                  onClick={() => setSelectedImageId(image.id)}
                >
                  <img
                    src={image.imageUrl || PRODUCT_IMAGE_PLACEHOLDER}
                    alt=""
                    onError={(event) => onProductImageError(event, product.nameAr)}
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="product-detail-copy">
          {product.brand?.name && <p className="product-detail-eyebrow">{product.brand.name}</p>}
          <h1>{product.nameAr}</h1>
          {selectedVariant && <p className="product-detail-sku">كود المنتج: <b dir="ltr">{selectedVariant.sku}</b></p>}
          {product.nameEn && <p className="product-detail-name-en" lang="en" dir="ltr">{product.nameEn}</p>}
          {product.categories.length > 0 && (
            <div className="product-detail-categories" aria-label="التصنيفات">
              {product.categories.map((category) => <span key={category.id}>{category.nameAr}</span>)}
            </div>
          )}

          {selectedVariant ? (
            <div className="product-detail-price" aria-live="polite">{formatPrice(selectedVariant.price)} ج.م</div>
          ) : (
            <p className="product-detail-unavailable">غير متاح حاليًا</p>
          )}

          {product.variants.length > 0 && (
            <fieldset className="product-variant-picker">
              <legend>اختر المواصفات</legend>
              <div className="product-variant-options">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    className={variant.id === selectedVariant?.id ? 'is-selected' : ''}
                    aria-pressed={variant.id === selectedVariant?.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                  >
                    {variant.titleAr || variant.sku}
                  </button>
                ))}
              </div>
              {selectedVariant && (
                <dl className="product-variant-details">
                  <div><dt>كود المنتج</dt><dd dir="ltr">{selectedVariant.sku}</dd></div>
                  {Object.entries(selectedVariant.attributes).map(([key, value]) => (
                    <div key={key}><dt>{key}</dt><dd>{typeof value === 'string' || typeof value === 'number' ? String(value) : JSON.stringify(value)}</dd></div>
                  ))}
                </dl>
              )}
            </fieldset>
          )}

          {product.descriptionAr && <div className="product-description"><h2>وصف المنتج</h2><p>{product.descriptionAr}</p></div>}
          <Link className="product-back-link" href="/ar/products">العودة إلى جميع المنتجات</Link>
        </section>
      </div>
    </main>
  );
}
