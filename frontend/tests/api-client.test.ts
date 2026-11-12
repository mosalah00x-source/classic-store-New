import test from 'node:test';
import assert from 'node:assert/strict';
import { apiRequest, getSession, setSession, type TokenResponse } from '../src/lib/api';

const originalFetch = globalThis.fetch;
const tokens: TokenResponse = { accessToken: 'access-old', refreshToken: 'refresh-old', tokenType: 'Bearer', expiresIn: 900 };

test('401 triggers one refresh and retries the protected request', async () => {
  const calls: Array<{ url: string; authorization: string | null }> = [];
  let meAttempts = 0;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const headers = new Headers(init?.headers);
    calls.push({ url, authorization: headers.get('Authorization') });
    if (url.endsWith('/auth/refresh')) {
      return new Response(JSON.stringify({ accessToken: 'access-new', refreshToken: 'refresh-new', tokenType: 'Bearer', expiresIn: 900 }), { status: 200 });
    }
    meAttempts++;
    if (meAttempts === 1) return new Response(JSON.stringify({ code: 'INVALID_TOKEN' }), { status: 401 });
    return new Response(JSON.stringify({ id: 'u1', firstName: 'Test' }), { status: 200 });
  }) as typeof fetch;
  try {
    setSession(tokens);
    const result = await apiRequest<{ id: string }>('/me');
    assert.equal(result.id, 'u1');
    assert.equal(calls.length, 3);
    assert.equal(calls[0].authorization, 'Bearer access-old');
    assert.equal(calls[1].authorization, 'Bearer refresh-old');
    assert.equal(calls[2].authorization, 'Bearer access-new');
    assert.equal(getSession()?.refreshToken, 'refresh-new');
  } finally { setSession(null); globalThis.fetch = originalFetch; }
});

test('failed refresh clears the in-memory session', async () => {
  globalThis.fetch = (async () => new Response(JSON.stringify({ code: 'INVALID_TOKEN' }), { status: 401 })) as typeof fetch;
  try {
    setSession(tokens);
    await assert.rejects(() => apiRequest('/me'), { status: 401 });
    assert.equal(getSession(), null);
  } finally { setSession(null); globalThis.fetch = originalFetch; }
});
