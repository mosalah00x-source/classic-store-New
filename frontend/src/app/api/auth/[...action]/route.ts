import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.BACKEND_API_BASE_URL ?? 'http://localhost:8080/api/v1';
const ACCESS_COOKIE = 'classic_store_access';
const REFRESH_COOKIE = 'classic_store_refresh';

type TokenResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/'
};

function setTokens(response: NextResponse, tokens: TokenResponse) {
  response.cookies.set(ACCESS_COOKIE, tokens.accessToken, {
    ...cookieOptions,
    maxAge: Math.max(1, tokens.expiresIn)
  });
  response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7
  });
}

function clearTokens(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, '', { ...cookieOptions, maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, '', { ...cookieOptions, maxAge: 0 });
}

async function backend(path: string, init: RequestInit = {}) {
  return fetch(`${API_BASE}${path}`, {
    ...init,
    cache: 'no-store',
    headers: { Accept: 'application/json', ...(init.headers ?? {}) }
  });
}

async function jsonBody(request: NextRequest) {
  return request.json().catch(() => ({})) as Promise<Record<string, unknown>>;
}

export async function POST(request: NextRequest, context: { params: Promise<{ action: string[] }> }) {
  const { action: segments } = await context.params;
  const action = segments.join('/');
  const body = await jsonBody(request);

  if (action === 'login') {
    const upstream = await backend('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const payload = await upstream.json().catch(() => ({}));
    if (!upstream.ok) return NextResponse.json(payload, { status: upstream.status });

    const tokens = payload as TokenResponse;
    const me = await backend('/me', { headers: { Authorization: `Bearer ${tokens.accessToken}` } });
    const response = NextResponse.json({ user: me.ok ? await me.json() : null });
    setTokens(response, tokens);
    return response;
  }

  if (action === 'register') {
    const upstream = await backend('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return NextResponse.json(await upstream.json().catch(() => ({})), { status: upstream.status });
  }

  if (action === 'refresh') {
    const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
    if (!refreshToken) return NextResponse.json({ code: 'UNAUTHENTICATED' }, { status: 401 });
    const upstream = await backend('/auth/refresh', {
      method: 'POST',
      headers: { Authorization: `Bearer ${refreshToken}` }
    });
    const payload = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const response = NextResponse.json(payload, { status: upstream.status });
      clearTokens(response);
      return response;
    }
    const response = NextResponse.json({ refreshed: true });
    setTokens(response, payload as TokenResponse);
    return response;
  }

  if (action === 'logout') {
    const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
    if (accessToken) await backend('/auth/logout', { method: 'POST', headers: { Authorization: `Bearer ${accessToken}` } });
    const response = new NextResponse(null, { status: 204 });
    clearTokens(response);
    return response;
  }

  if (action === 'password/forgot') {
    const upstream = await backend('/auth/password/forgot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return NextResponse.json(await upstream.json().catch(() => ({})), { status: upstream.status });
  }

  if (action === 'password/reset') {
    const token = typeof body.token === 'string' ? body.token : '';
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';
    const upstream = await backend('/auth/password/reset', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ newPassword })
    });
    const payload = await upstream.json().catch(() => undefined);
    return payload === undefined
      ? new NextResponse(null, { status: upstream.status })
      : NextResponse.json(payload, { status: upstream.status });
  }

  return NextResponse.json({ code: 'NOT_FOUND' }, { status: 404 });
}

export async function GET(request: NextRequest, context: { params: Promise<{ action: string[] }> }) {
  const { action: segments } = await context.params;
  if (segments.join('/') !== 'me') return NextResponse.json({ code: 'NOT_FOUND' }, { status: 404 });

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  if (!accessToken) return NextResponse.json({ code: 'UNAUTHENTICATED' }, { status: 401 });

  let upstream = await backend('/me', { headers: { Authorization: `Bearer ${accessToken}` } });
  if (upstream.status === 401) {
    const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
    if (refreshToken) {
      const refreshed = await backend('/auth/refresh', {
        method: 'POST',
        headers: { Authorization: `Bearer ${refreshToken}` }
      });
      if (refreshed.ok) {
        const tokens = (await refreshed.json()) as TokenResponse;
        upstream = await backend('/me', { headers: { Authorization: `Bearer ${tokens.accessToken}` } });
        const response = NextResponse.json(await upstream.json().catch(() => ({})), { status: upstream.status });
        setTokens(response, tokens);
        return response;
      }
    }
  }

  const payload = await upstream.json().catch(() => ({}));
  const response = NextResponse.json(payload, { status: upstream.status });
  if (upstream.status === 401) clearTokens(response);
  return response;
}
