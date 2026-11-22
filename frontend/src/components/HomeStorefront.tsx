import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/direction';
import type { CatalogCategory, ProductSummary } from '@/lib/catalog-types';
import { formatPrice } from '@/lib/price-format';
import { PRODUCT_IMAGE_PLACEHOLDER, onProductImageError } from '@/lib/product-image';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';

type Props = {
  locale: Locale;
  categories: CatalogCategory[];
  products: ProductSummary[];
  categoriesError: boolean;
  productsError: boolean;
};

function SectionHeading({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return (
    <div className="home-section-heading">
      <p className="home-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {note && <p className="home-section-note">{note}</p>}
    </div>
  );
}

function ProductCard({ product, locale, unavailableLabel, currency }: {
  product: ProductSummary;
  locale: Locale;
  unavailableLabel: string;
  currency: string;
}) {
  const name = locale === 'ar' ? product.nameAr : product.nameEn || product.nameAr;
  const imageUrl = product.primaryImage?.imageUrl || PRODUCT_IMAGE_PLACEHOLDER;
  return (
    <article className="home-product-card">
      <Link className="home-product-link" href={`/products/${product.slug}`}>
        <div className="home-product-image">
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            onError={(event) => onProductImageError(event, name)}
          />
        </div>
        <div className="home-product-copy">
          <h3>{name}</h3>
          <p className="home-product-price">
            {product.priceFrom === null ? unavailableLabel : <>{formatPrice(product.priceFrom)} {currency}</>}
          </p>
        </div>
      </Link>
    </article>
  );
}

export async function HomeStorefront({ locale, categories, products, categoriesError, productsError }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage' });
  const rootCategories = categories
    .filter((category) => category.parentId === null)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 8);
  const bestSellers = products.slice(0, 4);
  const newArrivals = products.slice(4, 8);

  return (
    <main className="home-shell">
      <section className="home-hero" aria-labelledby="home-hero-title">
        <div className="home-hero-copy">
          <p className="home-eyebrow">{t('heroEyebrow')}</p>
          <h1 id="home-hero-title">{t('heroTitle')}</h1>
          <p className="home-hero-description">{t('heroDescription')}</p>
          <Link className="home-primary-button" href="/products">{t('heroCta')}</Link>
        </div>
        <div className="home-hero-art" aria-hidden="true">
          <span className="home-hero-art-orbit" />
          <span className="home-hero-art-disc" />
          <span className="home-hero-art-line" />
        </div>
      </section>

      <section className="home-section" aria-labelledby="home-categories-title">
        <SectionHeading eyebrow={t('categoriesEyebrow')} title={t('categoriesTitle')} />
        {categoriesError ? (
          <ErrorState locale={locale} title={t('categoriesErrorTitle')} messageAr={t('categoriesErrorMessage')} messageEn={t('categoriesErrorMessage')} />
        ) : rootCategories.length === 0 ? (
          <EmptyState title={t('categoriesEmptyTitle')} message={t('categoriesEmptyMessage')} />
        ) : (
          <div className="home-category-grid">
            {rootCategories.map((category) => {
              const name = locale === 'ar' ? category.nameAr : category.nameEn || category.nameAr;
              return (
                <Link className="home-category-card" href={`/products?categoryId=${encodeURIComponent(category.id)}`} key={category.id}>
                  <span className="home-category-placeholder" aria-hidden="true">
                    <img src={PRODUCT_IMAGE_PLACEHOLDER} alt="" loading="lazy" />
                  </span>
                  <span className="home-category-name">{name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="home-section" aria-labelledby="home-best-sellers-title">
        <SectionHeading eyebrow={t('bestSellersEyebrow')} title={t('bestSellersTitle')} note={t('bestSellersFallbackNote')} />
        {productsError ? (
          <ErrorState locale={locale} title={t('productsErrorTitle')} messageAr={t('productsErrorMessage')} messageEn={t('productsErrorMessage')} />
        ) : bestSellers.length === 0 ? (
          <EmptyState title={t('productsEmptyTitle')} message={t('productsEmptyMessage')} />
        ) : (
          <div className="home-product-grid">
            {bestSellers.map((product) => <ProductCard key={product.id} product={product} locale={locale} unavailableLabel={t('priceUnavailable')} currency={t('currency')} />)}
          </div>
        )}
      </section>

      <section className="home-promo" aria-labelledby="home-promo-title">
        <div className="home-promo-copy">
          <p className="home-eyebrow">{t('promoEyebrow')}</p>
          <h2 id="home-promo-title">{t('promoTitle')}</h2>
          <p>{t('promoDescription')}</p>
          <Link className="home-primary-button" href="/products">{t('promoCta')}</Link>
        </div>
        <div className="home-promo-placeholder" aria-hidden="true">
          <span className="home-promo-placeholder-shape" />
        </div>
      </section>

      <section className="home-section" aria-labelledby="home-arrivals-title">
        <SectionHeading eyebrow={t('newArrivalsEyebrow')} title={t('newArrivalsTitle')} />
        {productsError ? (
          <ErrorState locale={locale} title={t('productsErrorTitle')} messageAr={t('productsErrorMessage')} messageEn={t('productsErrorMessage')} />
        ) : newArrivals.length === 0 ? (
          <EmptyState title={t('arrivalsEmptyTitle')} message={t('arrivalsEmptyMessage')} />
        ) : (
          <div className="home-product-grid">
            {newArrivals.map((product) => <ProductCard key={product.id} product={product} locale={locale} unavailableLabel={t('priceUnavailable')} currency={t('currency')} />)}
          </div>
        )}
      </section>

      <section className="home-services" aria-labelledby="home-services-title">
        <SectionHeading eyebrow={t('servicesEyebrow')} title={t('servicesTitle')} />
        <div className="home-service-grid">
          {[1, 2, 3].map((number) => (
            <article className="home-service-card" key={number}>
              <span className="home-service-number" aria-hidden="true">{String(number).padStart(2, '0')}</span>
              <h3>{t(`service${number}Title`)}</h3>
              <p>{t(`service${number}Description`)}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
