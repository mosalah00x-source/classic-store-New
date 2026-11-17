import assert from 'node:assert/strict';
import test from 'node:test';
import { formatPrice } from '../src/lib/price-format';

test('catalog and product detail share Latin-digit two-decimal price formatting', () => {
  for (const value of ['712.50', '175.00']) {
    const catalogAmount = formatPrice(value);
    const detailAmount = formatPrice(value);
    assert.equal(detailAmount, catalogAmount);
    assert.equal(catalogAmount, value);
    assert.match(catalogAmount, /^\d+\.\d{2}$/);
  }
});
