'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { ProductDetail } from '@/lib/product-detail-api';
import { onProductImageError, PRODUCT_IMAGE_PLACEHOLDER } from '@/lib/product-image';
import { formatPrice } from '@/lib/price-format';

export function ProductDetailClient({ product }: { product: ProductDetail }) {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const priceT = useTranslations('ProductPrice');
  const t = useTranslations('ProductDetail');
  const productName = isAr ? product.nameAr : product.nameEn || product.nameAr;
  const productDescription = isAr ? product.descriptionAr : product.descriptionEn || product.descriptionAr;
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
      <nav className="product-breadcrumb" aria-label={t('breadcrumbLabel')}>
        <Link href="/">{t('home')}</Link>
        <span aria-hidden="true">&gt;</span>
        <Link href="/products">{t('allProducts')}</Link>
        <span aria-hidden="true">&gt;</span>
        <span aria-current="page">{productName}</span>
      </nav>

      <div className="product-detail-grid">
        <section className="product-gallery" aria-label={t('productImages')}>
          <div className="product-gallery-main">
            {selectedImage ? (
              <img
                src={selectedImage.imageUrl || PRODUCT_IMAGE_PLACEHOLDER}
                alt={selectedImage.altAr || productName}
                onError={(event) => onProductImageError(event, productName)}
              />
            ) : (
              <div className="product-gallery-empty" role="img" aria-label={t('noProductImage')}>{t('noImage')}</div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="product-gallery-thumbnails" aria-label={t('chooseImage')}>
              {gallery.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  className={image.id === selectedImage?.id ? 'is-selected' : ''}
                  aria-label={image.altAr || t('imageNumber', { number: index + 1 })}
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
          <h1>{productName}</h1>
          {selectedVariant && <p className="product-detail-sku">{t('skuLabel')} <b dir="ltr">{selectedVariant.sku}</b></p>}
          {isAr && product.nameEn && <p className="product-detail-name-en" lang="en" dir="ltr">{product.nameEn}</p>}
          {product.categories.length > 0 && (
            <div className="product-detail-categories" aria-label={t('categories')}>
              {product.categories.map((category) => <span key={category.id}>{isAr ? category.nameAr : category.nameEn || category.nameAr}</span>)}
            </div>
          )}

          {selectedVariant ? (() => {
            const currentRaw = selectedVariant.price.trim();
            const oldRaw = product.oldPrice?.trim();
            const currentPrice = currentRaw === '' ? Number.NaN : Number(currentRaw);
            const oldPrice = oldRaw == null || oldRaw === '' ? Number.NaN : Number(oldRaw);
            const hasDiscount = Number.isFinite(currentPrice)
              && Number.isFinite(oldPrice)
              && oldPrice > currentPrice;
            const percent = hasDiscount
              ? product.discountPercent ?? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
              : 0;
            const savings = hasDiscount ? (oldPrice - currentPrice).toFixed(2) : '';

            return (
              <>
                <div className="product-detail-price" aria-live="polite">{formatPrice(selectedVariant.price)} {t('currency')}</div>
                {hasDiscount && (
                  <div className="product-price-promotion">
                    <span className="product-price-old">
                      <span className="visually-hidden">{priceT('oldPriceLabel')}: </span>
                      <s aria-hidden="true">{formatPrice(oldRaw)} {t('currency')}</s>
                    </span>
                    <span className="product-price-badge">{priceT('discountBadge', { percent })}</span>
                    <span className="product-price-savings">{priceT('savings', { amount: formatPrice(savings) })}</span>
                  </div>
                )}
              </>
            );
          })() : (
            <p className="product-detail-unavailable">{t('unavailable')}</p>
          )}

          {product.variants.length > 0 && (
            <fieldset className="product-variant-picker">
              <legend>{t('chooseOption')}</legend>
              <div className="product-variant-options">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    className={variant.id === selectedVariant?.id ? 'is-selected' : ''}
                    aria-pressed={variant.id === selectedVariant?.id}
                    onClick={() => setSelectedVariantId(variant.id)}
                  >
                    {isAr ? variant.titleAr || variant.sku : variant.sku}
                  </button>
                ))}
              </div>
              {selectedVariant && (
                <dl className="product-variant-details">
                  <div><dt>{t('skuLabel')}</dt><dd dir="ltr">{selectedVariant.sku}</dd></div>
                  {Object.entries(selectedVariant.attributes).map(([key, value]) => (
                    <div key={key}><dt>{key}</dt><dd>{typeof value === 'string' || typeof value === 'number' ? String(value) : JSON.stringify(value)}</dd></div>
                  ))}
                </dl>
              )}
            </fieldset>
          )}

          {productDescription && <div className="product-description"><h2>{t('description')}</h2><p>{productDescription}</p></div>}
          <Link className="product-back-link" href="/products">{t('backToAllProducts')}</Link>
        </section>
      </div>
    </main>
  );
}
