import assert from 'node:assert/strict';
import test from 'node:test';
import { decideProductDetail } from '../src/lib/product-detail-decision';
import { getProductDetail, mockProductDetails, ProductDetailRequestError } from '../src/lib/product-detail-api';
import { handleCatalogMock } from '../src/lib/catalog-mock-handlers';
import type { ProductPage } from '../src/lib/catalog-types';
import { renderToStaticMarkup } from 'react-dom/server';
import { ProductDetailClient } from '../src/components/ProductDetailClient';
import { NextIntlClientProvider } from 'next-intl';
import arMessages from '../src/messages/ar.json';


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
    const html = renderToStaticMarkup(
      <NextIntlClientProvider locale="ar" messages={arMessages}>
        <ProductDetailClient product={product} />
      </NextIntlClientProvider>
    );
    assert.doesNotMatch(html, /ProductTheme\./, `raw translation key rendered for ${product.slug}`);
    assert.doesNotMatch(html, /\b(?:null|undefined)\b/, `unexpected nullish text for ${product.slug}`);
  }
});


test('showcase detail mocks cover all 18 catalog slugs and preserve catalog values', async () => {
  const response = handleCatalogMock('https://catalog.invalid/products?page=0&size=20', 'showcase');
  assert.ok(response);
  const catalogPage = (await response.json()) as ProductPage;
  const environment = { API_MOCKING: 'true', API_MOCK_SCENARIO: 'showcase', NODE_ENV: 'test' };
  const details = await Promise.all(catalogPage.content.map((product) => getProductDetail(product.slug, environment)));

  assert.equal(details.length, 18);
  assert.deepEqual(details.map((product) => product.slug), catalogPage.content.map((product) => product.slug));

  for (const [index, summary] of catalogPage.content.entries()) {
    const detail = details[index];
    assert.ok(detail);
    assert.equal(detail.nameAr, summary.nameAr);
    assert.deepEqual(detail.categories, summary.categories);
    assert.equal(detail.variants.length, 1);
    assert.equal(detail.variants[0]?.price, summary.priceFrom);
    assert.equal(Object.hasOwn(detail, 'oldPrice'), false);
    assert.equal(Object.hasOwn(detail, 'discount'), false);
    assert.equal(Object.hasOwn(detail.variants[0] ?? {}, 'oldPrice'), false);
    assert.equal(Object.hasOwn(detail.variants[0] ?? {}, 'discount'), false);
    assert.equal(detail.brand, null);
    assert.equal(detail.images.length, index === 0 ? 4 : 1);
    assert.ok(detail.images.every((image) => image.imageUrl === '/mock/showcase-placeholder.svg'));
    assert.equal(detail.descriptionAr !== null, index === 4);
  }

  const skus = details.map((product) => product.variants[0]?.sku);
  assert.equal(new Set(skus).size, 18);
  assert.equal(skus[4], 'SHOWCASE-05');
  assert.equal(skus[0], 'SHOWCASE-01');
  assert.equal(skus[17], 'SHOWCASE-18');
  assert.ok(skus.every((sku) => /^SHOWCASE-\d{2}$/.test(sku ?? '')));
});

test('showcase detail data is isolated from the existing many and default detail behavior', async () => {
  const existingEnvironment = { API_MOCKING: 'true', NODE_ENV: 'test' };
  const manyEnvironment = { API_MOCKING: 'true', API_MOCK_SCENARIO: 'many', NODE_ENV: 'test' };
  const showcaseEnvironment = { API_MOCKING: 'true', API_MOCK_SCENARIO: 'showcase', NODE_ENV: 'test' };

  assert.equal((await getProductDetail('classic-blender', existingEnvironment)).slug, 'classic-blender');
  assert.equal((await getProductDetail('classic-blender', manyEnvironment)).slug, 'classic-blender');
  await assert.rejects(
    getProductDetail('showcase-tie-floral-85', existingEnvironment),
    (error: unknown) => error instanceof ProductDetailRequestError && error.status === 404
  );
  await assert.rejects(
    getProductDetail('showcase-tie-floral-85', manyEnvironment),
    (error: unknown) => error instanceof ProductDetailRequestError && error.status === 404
  );
  assert.equal((await getProductDetail('showcase-tie-floral-85', showcaseEnvironment)).slug, 'showcase-tie-floral-85');
});
