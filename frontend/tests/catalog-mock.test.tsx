import test from 'node:test';
import assert from 'node:assert/strict';
import { handleCatalogMock, isCatalogMockEnabled } from '../src/lib/catalog-mock-handlers';
import { hasMoreCatalogPages, mergeProductItems, parseCatalogFilters } from '../src/lib/catalog-filters';
import { onProductImageError, PRODUCT_IMAGE_PLACEHOLDER } from '../src/lib/product-image';

test('catalog mocks include null image, null price, null brand and multiple categories', async () => {
  const response = handleCatalogMock('https://catalog.invalid/products?page=0&size=20');
  assert.ok(response);
  const body = await response.json();
  assert.equal(body.content[1].primaryImage, null);
  assert.equal(body.content[1].priceFrom, null);
  assert.equal(body.content[1].brand, null);
  assert.equal(body.content[0].categories.length, 2);
});

test('catalog mock returns an empty page for unmatched query', async () => {
  const response = handleCatalogMock('https://catalog.invalid/products?q=not-found');
  assert.ok(response);
  const body = await response.json();
  assert.equal(body.content.length, 0);
  assert.equal(body.totalElements, 0);
});

test('catalog mock returns contract-shaped 400 and 500 errors', async () => {
  const invalid = handleCatalogMock('https://catalog.invalid/products?minPrice=900.00&maxPrice=10.00');
  const failure = handleCatalogMock('https://catalog.invalid/products?q=__mock_500__');
  assert.ok(invalid && failure);
  assert.equal(invalid.status, 400);
  assert.equal(failure.status, 500);
  assert.equal((await invalid.json()).code, 'VALIDATION_ERROR');
  assert.equal((await failure.json()).code, 'INTERNAL_ERROR');
});

test('catalog mock paginates deterministically', async () => {
  const first = handleCatalogMock('https://catalog.invalid/products?page=0&size=2');
  const second = handleCatalogMock('https://catalog.invalid/products?page=1&size=2');
  assert.ok(first && second);
  const firstBody = await first.json();
  const secondBody = await second.json();
  assert.equal(firstBody.content.length, 2);
  assert.equal(secondBody.content.length, 1);
  assert.notEqual(firstBody.content[0].id, secondBody.content[0].id);
});

test('URL filters normalize invalid values and reset page to zero', () => {
  assert.deepEqual(parseCatalogFilters({ q: '  خلاط  ', minPrice: '-1', maxPrice: '10.5', sort: 'unknown', page: '9' }), {
    q: 'خلاط', categoryId: undefined, minPrice: undefined, maxPrice: '10.50', sort: 'newest', page: 0, size: 20
  });
  assert.equal(parseCatalogFilters({ minPrice: '90', maxPrice: '10' }).minPrice, undefined);
});

test('load-more merge appends only unseen product IDs', async () => {
  const response = handleCatalogMock('https://catalog.invalid/products?page=0&size=20');
  assert.ok(response);
  const body = await response.json();
  const merged = mergeProductItems(body.content.slice(0, 2), [body.content[1], body.content[2]]);
  assert.equal(merged.length, 3);
});

test('many mock scenario provides 45 unique products across 20/20/5 pages', async () => {
  const pages = await Promise.all([0, 1, 2].map(async (page) => {
    const response = handleCatalogMock(`https://catalog.invalid/products?page=${page}&size=20`, 'many');
    assert.ok(response);
    return response.json();
  }));
  assert.deepEqual(pages.map((page) => page.content.length), [20, 20, 5]);
  assert.deepEqual(pages.map((page) => page.totalElements), [45, 45, 45]);
  const ids = pages.flatMap((page) => page.content.map((product) => product.id));
  assert.equal(new Set(ids).size, 45);
  assert.equal(hasMoreCatalogPages(pages[2]), false);
  assert.equal(hasMoreCatalogPages(pages[0]), true);
  const all = pages.flatMap((page) => page.content);
  assert.ok(all.some((product) => product.priceFrom === null));
  assert.ok(all.some((product) => product.primaryImage === null));
  assert.ok(all.some((product) => product.brand === null));
});

test('mock responder is disabled in production even when API_MOCKING=true', () => {
  assert.equal(isCatalogMockEnabled({ API_MOCKING: 'true', NODE_ENV: 'production' }), false);
  assert.equal(isCatalogMockEnabled({ API_MOCKING: 'true', NODE_ENV: 'development' }), true);
  assert.equal(isCatalogMockEnabled({ API_MOCKING: 'false', NODE_ENV: 'development' }), false);
});

test('Arabic plural rules cover zero, one, two, few and many', () => {
  const rules = new Intl.PluralRules('ar');
  assert.deepEqual([0, 1, 2, 3, 11].map((count) => rules.select(count)), ['zero', 'one', 'two', 'few', 'many']);
});

test('failed product image switches to the shared placeholder asset', () => {
  const image = {
    src: '/mock/broken.svg',
    alt: 'صورة المنتج',
    dataset: {} as DOMStringMap,
    hidden: false
  };
  onProductImageError({ currentTarget: image } as unknown as React.SyntheticEvent<HTMLImageElement>, 'لا توجد صورة');
  assert.equal(image.src, PRODUCT_IMAGE_PLACEHOLDER);
  assert.equal(image.alt, 'لا توجد صورة');
  assert.equal(image.dataset.fallbackApplied, 'true');
});

test('load more is hidden when the final page has been reached', () => {
  assert.equal(hasMoreCatalogPages({ page: 2, totalPages: 3 }), false);
  assert.equal(hasMoreCatalogPages({ page: 0, totalPages: 3 }), true);
});
