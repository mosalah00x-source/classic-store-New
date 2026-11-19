import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetailClient } from '@/components/ProductDetailClient';
import { decideProductDetail } from '@/lib/product-detail-decision';
import { getProductDetail, ProductDetailRequestError } from '@/lib/product-detail-api';

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const product = await getProductDetail(slug);
    return {
      title: locale === 'ar' ? product.nameAr : product.nameEn || product.nameAr,
      description: locale === 'ar' ? (product.descriptionAr ?? `تفاصيل ${product.nameAr} من كلاسيك ستور.`) : (product.descriptionEn ?? product.nameEn ?? product.nameAr),
      alternates: { canonical: `/${locale}/products/${encodeURIComponent(product.slug)}` },
      openGraph: {
        title: locale === 'ar' ? product.nameAr : product.nameEn || product.nameAr,
        description: (locale === 'ar' ? product.descriptionAr : product.descriptionEn) ?? undefined,
        type: 'website',
        images: product.images[0] ? [{ url: product.images[0].imageUrl, alt: product.images[0].altAr ?? product.nameAr }] : []
      }
    };
  } catch {
    return { title: locale === 'ar' ? 'المنتج | كلاسيك ستور' : 'Product | Classic Store' };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;

  const result = await getProductDetail(slug)
    .then((product) => ({ ok: true as const, product }))
    .catch((error: unknown) => ({ ok: false as const, error }));
  const decision = decideProductDetail(result);

  if (decision.kind === 'notFound') notFound();

  if (decision.kind === 'error') {
    return (
      <main className="catalog-shell">
        <h1>{locale === 'ar' ? 'تعذر تحميل تفاصيل المنتج' : 'Unable to load product details'}</h1>
        <section className="catalog-state" role="alert">
          <p>{decision.error instanceof ProductDetailRequestError ? decision.error.message : locale === 'ar' ? 'حدثت مشكلة أثناء تحميل تفاصيل المنتج. حاول مرة أخرى.' : 'There was a problem loading product details. Please try again.'}</p>
          <a href={`/ar/products/${encodeURIComponent(slug)}`}>إعادة المحاولة</a>
        </section>
      </main>
    );
  }

  return <ProductDetailClient product={decision.product} />;
}
