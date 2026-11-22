import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { LoadingState } from '../src/components/LoadingState';
import { EmptyState } from '../src/components/EmptyState';
import { ErrorState } from '../src/components/ErrorState';
import { getHomeCategoryName, getHomeProductName } from '../src/lib/home-content';
import type { CatalogCategory, ProductSummary } from '../src/lib/catalog-types';

type HomeMessages = Record<string, string>;

const root = resolve(process.cwd(), 'src');
const ar = JSON.parse(readFileSync(join(root, 'messages/ar.json'), 'utf8')) as { HomePage: HomeMessages };
const en = JSON.parse(readFileSync(join(root, 'messages/en.json'), 'utf8')) as { HomePage: HomeMessages };
const requiredKeys = [
  'metadataTitle', 'metadataDescription', 'heroEyebrow', 'heroTitle', 'heroDescription', 'heroCta',
  'categoriesEyebrow', 'categoriesTitle', 'categoriesErrorTitle', 'categoriesErrorMessage',
  'categoriesEmptyTitle', 'categoriesEmptyMessage', 'bestSellersEyebrow', 'bestSellersTitle',
  'bestSellersFallbackNote', 'productsErrorTitle', 'productsErrorMessage', 'productsEmptyTitle',
  'productsEmptyMessage', 'priceUnavailable', 'promoEyebrow', 'promoTitle', 'promoDescription',
  'promoCta', 'newArrivalsEyebrow', 'newArrivalsTitle', 'arrivalsEmptyTitle', 'arrivalsEmptyMessage',
  'servicesEyebrow', 'servicesTitle', 'service1Title', 'service1Description', 'service2Title',
  'service2Description', 'service3Title', 'service3Description', 'currency', 'loadingTitle', 'loadingMessage',
  'categoryNameUnavailable', 'productNameUnavailable'
];

test('all Home UI messages exist in Arabic and English with matching keys', () => {
  for (const key of requiredKeys) {
    assert.ok(ar.HomePage[key], `Missing Arabic HomePage.${key}`);
    assert.ok(en.HomePage[key], `Missing English HomePage.${key}`);
  }
  assert.deepEqual(Object.keys(ar.HomePage).filter((key) => requiredKeys.includes(key)).sort(),
    Object.keys(en.HomePage).filter((key) => requiredKeys.includes(key)).sort());
});

test('Home page and component contain no hard-coded Arabic UI text', () => {
  const files = ['app/[locale]/page.tsx', 'components/HomeStorefront.tsx'];
  const arabicLiteral = new RegExp('[' + String.fromCharCode(0x0600) + '-' + String.fromCharCode(0x06ff) + ']', 'u');
  const violations = files.flatMap((file) => readFileSync(join(root, file), 'utf8')
    .split(String.fromCharCode(10))
    .flatMap((line, index) => arabicLiteral.test(line) ? [`${file}:${index + 1}: ${line.trim()}`] : []));
  assert.deepEqual(violations, []);
});

test('Home uses shared Loading, Empty and Error state components', () => {
  const page = readFileSync(join(root, 'app/[locale]/page.tsx'), 'utf8');
  const component = readFileSync(join(root, 'components/HomeStorefront.tsx'), 'utf8');
  assert.match(page, /<LoadingState/);
  assert.match(component, /<EmptyState/);
  assert.match(component, /<ErrorState/);
});

test('Home loading, empty and error state components render their accessible states', () => {
  const loading = renderToStaticMarkup(<LoadingState title={en.HomePage.loadingTitle} message={en.HomePage.loadingMessage} />);
  const empty = renderToStaticMarkup(<EmptyState title={en.HomePage.productsEmptyTitle} message={en.HomePage.productsEmptyMessage} />);
  const error = renderToStaticMarkup(<ErrorState locale="en" title={en.HomePage.productsErrorTitle} messageAr={ar.HomePage.productsErrorMessage} messageEn={en.HomePage.productsErrorMessage} />);
  assert.match(loading, /aria-live="polite"/);
  assert.match(empty, /No products available yet/);
  assert.match(error, /role="alert"/);
  assert.match(error, /There was a problem loading products/);
});


test('English Home uses English fallbacks when API names have no English value', () => {
  const category: CatalogCategory = { id: 'cat-1', parentId: null, nameAr: 'اسم عربي', nameEn: null, slug: 'category', sortOrder: 1 };
  const product: ProductSummary = { id: 'product-1', slug: 'product', nameAr: 'اسم عربي', nameEn: null, priceFrom: null, currency: 'EGP', primaryImage: null, brand: null, categories: [category] };
  const categoryName = getHomeCategoryName(category, 'en', en.HomePage.categoryNameUnavailable);
  const productName = getHomeProductName(product, 'en', en.HomePage.productNameUnavailable);
  assert.equal(categoryName, 'Category name unavailable in English');
  assert.equal(productName, 'Product name unavailable in English');
  assert.doesNotMatch(categoryName, /[\\u0600-\\u06FF]/u);
  assert.doesNotMatch(productName, /[\\u0600-\\u06FF]/u);
  assert.equal(getHomeCategoryName(category, 'ar', ar.HomePage.categoryNameUnavailable), 'اسم عربي');
  assert.equal(getHomeProductName(product, 'ar', ar.HomePage.productNameUnavailable), 'اسم عربي');
});
