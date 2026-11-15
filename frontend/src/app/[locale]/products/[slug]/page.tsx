import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { ProductDetailClient } from '@/components/ProductDetailClient';
import { decideProductDetail } from '@/lib/product-detail-decision';
import { getProductDetail, ProductDetailRequestError } from '@/lib/product-detail-api';

type PageProps = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== 'ar') return { title: 'Classic Store' };

  try {
    const product = await getProductDetail(slug);
    return {
      title: product.nameAr,
      description: product.descriptionAr ?? `تفاصيل ${product.nameAr} من كلاسيك ستور.`,
      alternates: { canonical: `/ar/products/${encodeURIComponent(product.slug)}` },
      openGraph: {
        title: product.nameAr,
        description: product.descriptionAr ?? undefined,
        type: 'website',
        images: product.images[0] ? [{ url: product.images[0].imageUrl, alt: product.images[0].altAr ?? product.nameAr }] : []
      }
    };
  } catch {
    return { title: 'المنتج | كلاسيك ستور' };
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (locale !== 'ar') redirect(`/ar/products/${encodeURIComponent(slug)}`);

  const result = await getProductDetail(slug)
    .then((product) => ({ ok: true as const, product }))
    .catch((error: unknown) => ({ ok: false as const, error }));
  const decision = decideProductDetail(result);

  if (decision.kind === 'notFound') notFound();

  if (decision.kind === 'error') {
    return (
      <main className="catalog-shell">
        <h1>تعذر تحميل تفاصيل المنتج</h1>
        <section className="catalog-state" role="alert">
          <p>{decision.error instanceof ProductDetailRequestError ? decision.error.message : 'حدثت مشكلة أثناء تحميل تفاصيل المنتج. حاول مرة أخرى.'}</p>
          <a href={`/ar/products/${encodeURIComponent(slug)}`}>إعادة المحاولة</a>
        </section>
      </main>
    );
  }

  return <ProductDetailClient product={decision.product} />;
}
