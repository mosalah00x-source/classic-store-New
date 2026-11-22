import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/direction';
import type { CatalogCategory, ProductSummary } from '@/lib/catalog-types';
import { formatPrice } from '@/lib/price-format';
import Image from 'next/image';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/lib/product-image';
import { getHomeCategoryName, getHomeProductName } from '@/lib/home-content';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';

type Props = {
  locale: Locale;
  categories: CatalogCategory[];
  products: ProductSummary[];
  categoriesError: boolean;
  productsError: boolean;
};

function SectionHeading({ id, eyebrow, title, note }: { id: string; eyebrow: string; title: string; note?: string }) {
  return (
    <div className="home-section-heading">
      <p className="home-eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {note && <p className="home-section-note">{note}</p>}
    </div>
  );
}

function ProductCard({ product, locale, unavailableLabel, currency, nameUnavailable }: {
  product: ProductSummary;
  locale: Locale;
  unavailableLabel: string;
  currency: string;
  nameUnavailable: string;
}) {
  const name = getHomeProductName(product, locale, nameUnavailable);
  const imageUrl = product.primaryImage?.imageUrl || PRODUCT_IMAGE_PLACEHOLDER;
  return (
    <article className="home-product-card">
      <Link className="home-product-link" href={`/products/${encodeURIComponent(product.slug)}`}>
        <div className="home-product-image">
          <Image src={imageUrl} alt={name} width={600} height={600} unoptimized loading="lazy" />
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
  const services = [
    { title: t('service1Title'), description: t('service1Description') },
    { title: t('service2Title'), description: t('service2Description') },
    { title: t('service3Title'), description: t('service3Description') }
  ];

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
        <SectionHeading id="home-categories-title" eyebrow={t('categoriesEyebrow')} title={t('categoriesTitle')} />
        {categoriesError ? (
          <ErrorState locale={locale} title={t('categoriesErrorTitle')} messageAr={t('categoriesErrorMessage')} messageEn={t('categoriesErrorMessage')} />
        ) : rootCategories.length === 0 ? (
          <EmptyState title={t('categoriesEmptyTitle')} message={t('categoriesEmptyMessage')} />
        ) : (
          <div className="home-category-grid">
            {rootCategories.map((category) => {
              const name = getHomeCategoryName(category, locale, t('categoryNameUnavailable'));
              return (
                <Link className="home-category-card" href={`/products?categoryId=${encodeURIComponent(category.id)}`} key={category.id}>
                  <span className="home-category-placeholder" aria-hidden="true">
                    <Image src={PRODUCT_IMAGE_PLACEHOLDER} alt="" width={300} height={300} unoptimized loading="lazy" />
                  </span>
                  <span className="home-category-name">{name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="home-section" aria-labelledby="home-best-sellers-title">
        <SectionHeading id="home-best-sellers-title" eyebrow={t('bestSellersEyebrow')} title={t('bestSellersTitle')} note={!productsError && products.length > 0 ? t('bestSellersFallbackNote') : undefined} />
        {productsError ? (
          <ErrorState locale={locale} title={t('productsErrorTitle')} messageAr={t('productsErrorMessage')} messageEn={t('productsErrorMessage')} />
        ) : bestSellers.length === 0 ? (
          <EmptyState title={t('productsEmptyTitle')} message={t('productsEmptyMessage')} />
        ) : (
          <div className="home-product-grid">
            {bestSellers.map((product) => <ProductCard key={product.id} product={product} locale={locale} unavailableLabel={t('priceUnavailable')} currency={t('currency')} nameUnavailable={t('productNameUnavailable')} />)}
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
        <SectionHeading id="home-arrivals-title" eyebrow={t('newArrivalsEyebrow')} title={t('newArrivalsTitle')} />
        {productsError ? (
          <ErrorState locale={locale} title={t('productsErrorTitle')} messageAr={t('productsErrorMessage')} messageEn={t('productsErrorMessage')} />
        ) : newArrivals.length === 0 ? (
          <EmptyState title={t('arrivalsEmptyTitle')} message={t('arrivalsEmptyMessage')} />
        ) : (
          <div className="home-product-grid">
            {newArrivals.map((product) => <ProductCard key={product.id} product={product} locale={locale} unavailableLabel={t('priceUnavailable')} currency={t('currency')} nameUnavailable={t('productNameUnavailable')} />)}
          </div>
        )}
      </section>

      <section className="home-services" aria-labelledby="home-services-title">
        <SectionHeading id="home-services-title" eyebrow={t('servicesEyebrow')} title={t('servicesTitle')} />
        <div className="home-service-grid">
          {services.map((service, index) => (
            <article className="home-service-card" key={service.title}>
              <span className="home-service-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
