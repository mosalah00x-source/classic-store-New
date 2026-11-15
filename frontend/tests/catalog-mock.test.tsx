import test from 'node:test';
import assert from 'node:assert/strict';
import { handleCatalogMock } from '../src/lib/catalog-mock-handlers';

test('catalog mocks include null image, null price, null brand and multiple categories', async () => {
  const response = handleCatalogMock('http://catalog.local/products?page=0&size=20');
  assert.ok(response);
  const body = await response.json();
  assert.equal(body.content[1].primaryImage, null);
  assert.equal(body.content[1].priceFrom, null);
  assert.equal(body.content[1].brand, null);
  assert.equal(body.content[0].categories.length, 2);
});

test('catalog mock returns an empty page for unmatched query', async () => {
  const response = handleCatalogMock('http://catalog.local/products?q=not-found');
  assert.ok(response);
  const body = await response.json();
  assert.equal(body.content.length, 0);
  assert.equal(body.totalElements, 0);
});

test('catalog mock returns contract-shaped 400 and 500 errors', async () => {
  const invalid = handleCatalogMock('http://catalog.local/products?minPrice=900.00&maxPrice=10.00');
  const failure = handleCatalogMock('http://catalog.local/products?q=__mock_500__');
  assert.ok(invalid && failure);
  assert.equal(invalid.status, 400);
  assert.equal(failure.status, 500);
  assert.equal((await invalid.json()).code, 'VALIDATION_ERROR');
  assert.equal((await failure.json()).code, 'INTERNAL_ERROR');
});

test('catalog mock paginates without returning the same page twice', async () => {
  const first = handleCatalogMock('http://catalog.local/products?page=0&size=2');
  const second = handleCatalogMock('http://catalog.local/products?page=1&size=2');
  assert.ok(first && second);
  const firstBody = await first.json();
  const secondBody = await second.json();
  assert.equal(firstBody.content.length, 2);
  assert.equal(secondBody.content.length, 1);
  assert.notEqual(firstBody.content[0].id, secondBody.content[0].id);
});
