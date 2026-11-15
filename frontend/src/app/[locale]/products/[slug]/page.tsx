import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { ProductDetailClient } from '@/components/ProductDetailClient';
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

  try {
    const product = await getProductDetail(slug);
    return <ProductDetailClient product={product} />;
  } catch (error) {
    if (error instanceof ProductDetailRequestError && error.status === 404) notFound();

    return (
      <main className="catalog-shell">
        <h1>تعذر تحميل تفاصيل المنتج</h1>
        <section className="catalog-state" role="alert">
          <p>{error instanceof ProductDetailRequestError ? error.message : 'حدثت مشكلة أثناء تحميل تفاصيل المنتج. حاول مرة أخرى.'}</p>
          <a href={`/ar/products/${encodeURIComponent(slug)}`}>إعادة المحاولة</a>
        </section>
      </main>
    );
  }
}
