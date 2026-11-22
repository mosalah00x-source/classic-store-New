import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from '@/components/ProductDetailClient';
import { decideProductDetail } from '@/lib/product-detail-decision';
import { getProductDetail, ProductDetailRequestError } from '@/lib/product-detail-api';

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'ProductPage' });

  try {
    const product = await getProductDetail(slug);
    return {
      title: locale === 'ar' ? product.nameAr : product.nameEn || product.nameAr,
      description: locale === 'ar' ? (product.descriptionAr ?? t('metadataDescription', { productName: product.nameAr })) : (product.descriptionEn ?? product.nameEn ?? product.nameAr),
      alternates: { canonical: `/${locale}/products/${encodeURIComponent(product.slug)}` },
      openGraph: {
        title: locale === 'ar' ? product.nameAr : product.nameEn || product.nameAr,
        description: (locale === 'ar' ? product.descriptionAr : product.descriptionEn) ?? undefined,
        type: 'website',
        images: product.images[0] ? [{ url: product.images[0].imageUrl, alt: product.images[0].altAr ?? product.nameAr }] : []
      }
    };
  } catch {
    return { title: t('metadataFallbackTitle') };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('ProductPage');

  const result = await getProductDetail(slug)
    .then((product) => ({ ok: true as const, product }))
    .catch((error: unknown) => ({ ok: false as const, error }));
  const decision = decideProductDetail(result);

  if (decision.kind === 'notFound') notFound();

  if (decision.kind === 'error') {
    return (
      <main className="catalog-shell">
        <h1>{t('errorTitle')}</h1>
        <section className="catalog-state" role="alert">
          <p>{decision.error instanceof ProductDetailRequestError ? (locale === 'ar' ? decision.error.payload?.messageAr : decision.error.payload?.messageEn) ?? decision.error.message : t('errorMessage')}</p>
          <a href={`/${locale}/products/${encodeURIComponent(slug)}`}>{t('retry')}</a>
        </section>
      </main>
    );
  }

  return <ProductDetailClient product={decision.product} />;
}
