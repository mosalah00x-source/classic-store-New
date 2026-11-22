import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd(), 'src');
const component = readFileSync(resolve(root, 'components/StorefrontBottomNav.tsx'), 'utf8');
const layout = readFileSync(resolve(root, 'app/[locale]/layout.tsx'), 'utf8');
const ar = JSON.parse(readFileSync(resolve(root, 'messages/ar.json'), 'utf8')) as { BottomNav: Record<string, string> };
const en = JSON.parse(readFileSync(resolve(root, 'messages/en.json'), 'utf8')) as { BottomNav: Record<string, string> };

test('bottom navigation is mounted once in the shared locale layout', () => {
  assert.equal(layout.split("import { StorefrontBottomNav }").length - 1, 1);
  assert.equal(layout.split("<StorefrontBottomNav />").length - 1, 1);
});

test('only home and products are active navigation links', () => {
  assert.ok(component.includes("{ id: 'home', href: '/', enabled: true }"));
  assert.ok(component.includes("{ id: 'products', href: '/products', enabled: true }"));
  assert.equal(component.split('enabled: false').length - 1, 4);
  assert.ok(component.includes('aria-disabled="true"'));
  assert.ok(component.includes('className="storefront-bottom-nav-item is-disabled"'));
  assert.ok(component.includes("t('comingSoon')"));
});

test('navigation has accessible current-page state and collapsible control', () => {
  assert.ok(component.includes("aria-current={active ? 'page' : undefined}"));
  assert.ok(component.includes('aria-expanded={expanded}'));
  assert.ok(component.includes("expanded ? '' : ' min'"));
  assert.ok(component.includes("aria-label={expanded ? t('collapse') : t('expand')}"));
});

test('collapse preference uses the agreed localStorage key with guarded access', () => {
  assert.ok(component.includes("classic-store:bottom-nav:v1"));
  assert.ok(component.includes('window.localStorage.getItem(STORAGE_KEY)'));
  assert.ok(component.includes('window.localStorage.setItem(STORAGE_KEY'));
  assert.ok(component.includes('try {'));
  assert.ok(component.includes('} catch {'));
});

test('Arabic and English navigation messages have matching complete keys', () => {
  assert.deepEqual(Object.keys(ar.BottomNav).sort(), Object.keys(en.BottomNav).sort());
  for (const key of ['navigation', 'collapse', 'expand', 'home', 'products', 'product', 'cart', 'checkout', 'done', 'comingSoon']) {
    assert.ok(ar.BottomNav[key], `Missing Arabic BottomNav.${key}`);
    assert.ok(en.BottomNav[key], `Missing English BottomNav.${key}`);
  }
  assert.equal(ar.BottomNav.comingSoon, 'قريباً');
  assert.equal(en.BottomNav.comingSoon, 'Coming soon');
  assert.ok(!component.includes('صفحات العرض'));
});
