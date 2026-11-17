import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readThemePreference, writeThemePreference } from '../src/lib/theme-preference';

test('theme defaults to light when storage is empty', () => {
  assert.equal(readThemePreference({ getItem: () => null, setItem: () => undefined }), 'light');
});

test('theme toggle preference writes and reads back', () => {
  const values = new Map<string, string>();
  const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
  writeThemePreference('dark', storage);
  assert.equal(readThemePreference(storage), 'dark');
  writeThemePreference('light', storage);
  assert.equal(readThemePreference(storage), 'light');
});

test('unavailable storage falls back to light without throwing', () => {
  assert.equal(readThemePreference(null), 'light');
  assert.doesNotThrow(() => writeThemePreference('dark', null));
});
