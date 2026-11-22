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

test('shared theme provider uses the single persisted theme preference', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/components/StorefrontThemeProvider.tsx'), 'utf8');
  assert.ok(source.includes('readThemePreference'));
  assert.ok(source.includes('writeThemePreference'));
  assert.ok(source.includes('toggleTheme'));
});

test('shared footer exposes store links and contact information', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/components/StorefrontFooter.tsx'), 'utf8');
  assert.ok(source.includes('storefront-footer'));
  assert.ok(source.includes('footerNavigation'));
  assert.ok(source.includes('contactComingSoon'));
});


test('category mega menu supports pointer, outside-click, Escape and keyboard navigation', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/components/StorefrontHeader.tsx'), 'utf8');
  for (const required of [
    'onMouseEnter={() => setMenuOpen(true)}',
    'onMouseLeave={() => {',
    "event.key === 'Escape'",
    "event.key === 'ArrowDown'",
    "event.key === 'ArrowUp'",
    "event.key === 'Home'",
    "event.key === 'End'",
    "document.addEventListener('pointerdown'",
    'aria-expanded={menuOpen}',
    'aria-haspopup="true"',
  ]) {
    assert.ok(source.includes(required), `Expected mega menu interaction: ${required}`);
  }
});

test('category mega menu CSS wraps long labels and prevents horizontal overflow', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');
  assert.match(source, /\.storefront-mega-menu[^}]*overflow-x:hidden/);
  assert.match(source, /\.storefront-mega-menu a\{[^}]*overflow-wrap:anywhere/);
  assert.match(source, /\.storefront-category-menu::after/);
  assert.match(source, /:dir\(rtl\) \.storefront-mega-menu/);
  assert.match(source, /:dir\(ltr\) \.storefront-mega-menu/);
});


test('catalog favorite button uses a stable SVG heart for both states', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/components/CatalogClient.tsx'), 'utf8');
  assert.match(source, /aria-pressed={isFavorite}/);
  assert.match(source, /aria-label={isFavorite \? t\('removeFromFavorites'\) : t\('addToFavorites'\)}/);
  assert.match(source, /<svg className="catalog-favorite-icon" viewBox="0 0 24 24" aria-hidden="true"/);
  assert.doesNotMatch(source, /isFavorite \? '♥' : '♡'/);
  const ar = JSON.parse(readFileSync(resolve(process.cwd(), 'src/messages/ar.json'), 'utf8'));
  const en = JSON.parse(readFileSync(resolve(process.cwd(), 'src/messages/en.json'), 'utf8'));
  for (const messages of [ar, en]) {
    assert.ok(messages.Catalog.addToFavorites);
    assert.ok(messages.Catalog.removeFromFavorites);
  }
});

test('catalog favorite SVG is outlined when inactive and filled when active', () => {
  const source = readFileSync(resolve(process.cwd(), 'src/app/globals.css'), 'utf8');
  assert.match(source, /\.catalog-favorite-icon \{[^}]*fill: none/);
  assert.match(source, /\.catalog-favorite-button\[aria-pressed="true"\] \.catalog-favorite-icon \{[^}]*fill: currentColor/);
});
