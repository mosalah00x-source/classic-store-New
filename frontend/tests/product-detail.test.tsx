import assert from 'node:assert/strict';
import test from 'node:test';
import { decideProductDetail } from '../src/lib/product-detail-decision';
import { getProductDetail, mockProductDetails, ProductDetailRequestError } from '../src/lib/product-detail-api';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ProductDetailClient } from '../src/components/ProductDetailClient';


test('product detail mock returns the public product contract with active variants and ordered images', async () => {
  const product = await getProductDetail('classic-blender', {
    API_MOCKING: 'true',
    NODE_ENV: 'test'
  });

  assert.equal(product.slug, 'classic-blender');
  assert.equal(product.variants.length, 2);
  assert.equal(product.variants[0]?.currency, 'EGP');
  assert.deepEqual(product.images.map((image) => image.sortOrder), [0, 1]);
  assert.equal(product.categories[0]?.slug, 'kitchen-appliances');
});

test('unknown slug 404 is classified as notFound', () => {
  const error = new ProductDetailRequestError('المنتج غير موجود.', 404);
  assert.deepEqual(decideProductDetail({ ok: false, error }), { kind: 'notFound' });
});

test('API 500 remains an error state and is not classified as notFound', () => {
  const error = new ProductDetailRequestError('تعذر تحميل تفاصيل المنتج.', 500);
  const decision = decideProductDetail({ ok: false, error });
  assert.equal(decision.kind, 'error');
  if (decision.kind === 'error') assert.equal(decision.error, error);
});

test('network errors remain an error state and are not classified as notFound', () => {
  const error = new TypeError('Network failure');
  const decision = decideProductDetail({ ok: false, error });
  assert.equal(decision.kind, 'error');
  if (decision.kind === 'error') assert.equal(decision.error, error);
});

test('valid product is passed through as a non-null product decision', () => {
  const product = mockProductDetails['classic-blender'];
  assert.ok(product);
  assert.deepEqual(decideProductDetail({ ok: true, product }), { kind: 'ok', product });
});

test('a null successful response is classified as notFound, not rendered as a product', () => {
  assert.deepEqual(decideProductDetail({ ok: true, product: null }), { kind: 'notFound' });
});

test('product detail fixture remains keyed by its canonical slug', () => {
  assert.equal(mockProductDetails['classic-blender']?.slug, 'classic-blender');
});

test('all detail mock variants render without null or undefined text', () => {
  const base = mockProductDetails['classic-blender'];
  assert.ok(base);
  const multiCategory = {
    id: '10000000-0000-4000-8000-000000000003',
    parentId: null,
    nameAr: 'أجهزة منزلية',
    nameEn: null,
    slug: 'home-appliances',
    sortOrder: 2
  };
  const cases = [
    base,
    { ...base, variants: base.variants.slice(0, 1) },
    { ...base, images: [] },
    { ...base, brand: null },
    { ...base, variants: [] },
    { ...base, categories: [...base.categories, multiCategory] }
  ];

  for (const product of cases) {
    const html = renderToStaticMarkup(createElement(ProductDetailClient, { product }));
    assert.doesNotMatch(html, /\\b(?:null|undefined)\\b/, `unexpected nullish text for ${product.slug}`);
  }
});
