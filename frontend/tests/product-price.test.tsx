import assert from 'node:assert/strict';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { NextIntlClientProvider } from 'next-intl';
import { ProductDetailClient } from '../src/components/ProductDetailClient';
import { mockProductDetails } from '../src/lib/product-detail-api';
import arMessages from '../src/messages/ar.json';
import enMessages from '../src/messages/en.json';

const base = mockProductDetails['classic-blender'];
assert.ok(base);

function render(product: typeof base, locale: 'ar' | 'en' = 'ar') {
  const messages = locale === 'ar' ? arMessages : enMessages;
  return renderToStaticMarkup(
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ProductDetailClient product={product} />
    </NextIntlClientProvider>
  );
}

test('old price greater than current renders old price, localized badge, savings and accessible label', () => {
  const html = render({ ...base, oldPrice: '950.00' });
  assert.match(html, /السعر السابق/);
  assert.match(html, /<s aria-hidden="true">950\.00 ج\.م<\/s>/);
  assert.match(html, /خصم 25%/);
  assert.match(html, /وفر 237\.50 ج\.م/);
  assert.match(html, /<s aria-hidden="true">/);
});

test('English product price promotion uses English message strings', () => {
  const html = render({ ...base, oldPrice: '950.00' }, 'en');
  assert.match(html, /Previous price/);
  assert.match(html, /25% off/);
  assert.match(html, /Save 237\.50 EGP/);
});

test('missing old price renders no old price, badge or savings and no nullish/raw keys', () => {
  const html = render({ ...base, oldPrice: undefined });
  assert.doesNotMatch(html, /السعر السابق|خصم \d+%|وفر .* ج\.م|\b(?:null|undefined)\b|ProductPrice\./);
});

test('old price equal to or less than current renders no promotion elements', () => {
  for (const oldPrice of ['712.50', '600.00']) {
    const html = render({ ...base, oldPrice });
    assert.doesNotMatch(html, /السعر السابق|خصم \d+%|وفر .* ج\.م/);
  }
});

test('950 to 712.50 rounds to 25 percent and 237.50 savings', () => {
  const oldPrice = Number('950.00'.trim());
  const currentPrice = Number('712.50'.trim());
  assert.equal(Math.round(((oldPrice - currentPrice) / oldPrice) * 100), 25);
  assert.equal((oldPrice - currentPrice).toFixed(2), '237.50');
});

test('non-numeric, blank and zero old prices render no promotion elements', () => {
  for (const oldPrice of ['not-a-price', '', '0']) {
    const html = render({ ...base, oldPrice });
    assert.doesNotMatch(html, /السعر السابق|خصم \d+%|وفر .* ج\.م/);
  }
});
