import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CATALOG_CART_ENABLED,
  CATALOG_PROMOTION_BADGES_ENABLED,
  FAVORITES_STORAGE_KEY,
  readFavoriteIds,
  saveFavoriteIds,
  toggleFavoriteId
} from '../src/lib/catalog-favorites';

test('favorites persist and restore using the agreed storage key', () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); }
  };
  const selected = toggleFavoriteId([], 'product-1');
  saveFavoriteIds(selected, storage);
  assert.equal(values.get(FAVORITES_STORAGE_KEY), '["product-1"]');
  assert.deepEqual(readFavoriteIds(storage), ['product-1']);
});

test('favorite storage failures do not throw and in-memory toggling still works', () => {
  const brokenStorage = {
    getItem: () => { throw new Error('storage blocked'); },
    setItem: () => { throw new Error('storage blocked'); }
  };
  assert.deepEqual(readFavoriteIds(brokenStorage), []);
  const inMemory = toggleFavoriteId([], 'product-2');
  assert.deepEqual(inMemory, ['product-2']);
  assert.doesNotThrow(() => saveFavoriteIds(inMemory, brokenStorage));
});

test('favorite IDs are unique and invalid stored values are ignored', () => {
  const storage = {
    getItem: () => '["a","a",null,4,"b",""]',
    setItem: () => undefined
  };
  assert.deepEqual(readFavoriteIds(storage), ['a', 'b']);
});

test('catalog card keeps cart disabled and promotion badges out of scope', () => {
  assert.equal(CATALOG_CART_ENABLED, false);
  assert.equal(CATALOG_PROMOTION_BADGES_ENABLED, false);
});
