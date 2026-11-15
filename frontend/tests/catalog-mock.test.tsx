import test from 'node:test';
import assert from 'node:assert/strict';
import { handleCatalogMock } from '../src/lib/catalog-mock-handlers';
import { mergeProductItems, parseCatalogFilters } from '../src/lib/catalog-filters';

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
