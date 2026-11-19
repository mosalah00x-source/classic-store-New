import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { getDirection } from '../src/i18n/direction';

test('storefront locale direction follows the selected locale', () => {
  assert.equal(getDirection('ar'), 'rtl');
  assert.equal(getDirection('en'), 'ltr');
});

test('shared header includes navigation, category menu, search, cart, locale and theme controls', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/components/StorefrontHeader.tsx'), 'utf8');
  for (const required of ['storefront-nav', 'storefront-mega-menu', 'role="search"', 'storefront-cart', 'storefront-icon-button', 'storefront-locale']) {
    assert.ok(source.includes(required), `Expected shared header control: ${required}`);
  }
});

test('shared footer exposes store links and contact information', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/components/StorefrontFooter.tsx'), 'utf8');
  assert.ok(source.includes('storefront-footer'));
  assert.ok(source.includes('footerNavigation'));
  assert.ok(source.includes('contactComingSoon'));
});
