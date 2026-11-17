import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

type Messages = Record<string, Record<string, unknown>>;

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(entry.name) ? [path] : [];
  });
}

function hasMessage(messages: Messages, namespace: string, key: string): boolean {
  const value = key.split('.').reduce<unknown>((current, part) => {
    if (current && typeof current === 'object' && Object.prototype.hasOwnProperty.call(current, part)) {
      return (current as Record<string, unknown>)[part];
    }
    return undefined;
  }, messages[namespace]);
  return value !== undefined && value !== null && value !== '';
}

test('all statically referenced next-intl messages exist in ar.json', () => {
  const src = resolve(process.cwd(), 'src');
  const messages = JSON.parse(readFileSync(join(src, 'messages/ar.json'), 'utf8')) as Messages;
  const missing: string[] = [];

  for (const file of sourceFiles(src)) {
    const source = readFileSync(file, 'utf8');
    const bindings = [...source.matchAll(
      /(?:const|let)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:await\s+)?(?:useTranslations|getTranslations)\(\s*['"]([^'"]+)['"]\s*\)/g
    )];

    for (const [, translator, namespace] of bindings) {
      const callPattern = new RegExp('\\b' + translator + '\\s*(?:\\.(?:rich|markup|raw|has))?\\(\\s*[\'"]([^\'"]+)[\'"]', 'g');
      for (const [, key] of source.matchAll(callPattern)) {
        if (!hasMessage(messages, namespace, key)) {
          missing.push(file.replace(src + '/', '') + ': ' + namespace + '.' + key);
        }
      }
    }
  }

  assert.deepEqual(missing, [], 'Missing Arabic translation messages:\n' + missing.join('\n'));
});
