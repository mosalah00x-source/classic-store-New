import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { ErrorState } from '../src/components/ErrorState';
import { getDirection } from '../src/i18n/direction';

test('getDirection returns rtl for Arabic locale', () => {
  assert.equal(getDirection('ar'), 'rtl');
});

test('getDirection returns ltr for English locale', () => {
  assert.equal(getDirection('en'), 'ltr');
});

test('ErrorState renders messageAr for Arabic locale', () => {
  const html = renderToStaticMarkup(<ErrorState locale="ar" title="خطأ" messageAr="تعذر التحميل" messageEn="Unable to load" />);
  assert.match(html, /تعذر التحميل/);
  assert.doesNotMatch(html, /Unable to load/);
});

test('ErrorState renders messageEn for English locale', () => {
  const html = renderToStaticMarkup(<ErrorState locale="en" title="Error" messageAr="تعذر التحميل" messageEn="Unable to load" />);
  assert.match(html, /Unable to load/);
  assert.doesNotMatch(html, /تعذر التحميل/);
});