import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <main className="catalog-shell">
      <nav className="product-breadcrumb" aria-label="مسار التنقل">
        <Link href="/ar/products">الرئيسية</Link>
        <span aria-hidden="true">&gt;</span>
        <span aria-current="page">المنتج غير موجود</span>
      </nav>
      <section className="catalog-state" role="status">
        <h1>المنتج غير موجود</h1>
        <p>قد يكون المنتج حُذف أو أن الرابط غير صحيح.</p>
        <Link href="/ar/products">العودة إلى جميع المنتجات</Link>
      </section>
    </main>
  );
}
