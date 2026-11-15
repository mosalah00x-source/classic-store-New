import assert from 'node:assert/strict';
import test from 'node:test';
import { getProductDetail, mockProductDetails, ProductDetailRequestError } from '../src/lib/product-detail-api';

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

test('product detail mock returns a not-found error for unknown slugs', async () => {
  await assert.rejects(
    () => getProductDetail('missing-product', { API_MOCKING: 'true', NODE_ENV: 'test' }),
    (error: unknown) => error instanceof ProductDetailRequestError && error.status === 404
  );
});

test('product detail fixture remains keyed by its canonical slug', () => {
  assert.equal(mockProductDetails['classic-blender']?.slug, 'classic-blender');
});
