import test from 'node:test';
import assert from 'node:assert/strict';
import { setSession, getSession, type TokenResponse } from '@/lib/api';

test('session tokens are held in memory and can be cleared', () => {
  const tokens: TokenResponse = { accessToken:'access', refreshToken:'refresh', tokenType:'Bearer', expiresIn:900 };
  setSession(tokens);
  assert.equal(getSession()?.accessToken, 'access');
  setSession(null);
  assert.equal(getSession(), null);
});
