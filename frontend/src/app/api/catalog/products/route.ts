import { NextRequest, NextResponse } from 'next/server';
import { handleCatalogMock, isCatalogMockEnabled } from '@/lib/catalog-mock-handlers';

const ALLOWED_PARAMS = ['q', 'categoryId', 'brandId', 'minPrice', 'maxPrice', 'sort', 'page', 'size'] as const;

export async function GET(request: NextRequest) {
  const incoming = new URL(request.url);
  const query = new URLSearchParams();
  for (const key of ALLOWED_PARAMS) {
    const value = incoming.searchParams.get(key);
    if (value !== null) query.set(key, value);
  }

  if (isCatalogMockEnabled(process.env)) {
    const scenario = process.env.API_MOCK_SCENARIO === 'many' ? 'many' : process.env.API_MOCK_SCENARIO === 'showcase' ? 'showcase' : 'default';
    const mocked = handleCatalogMock(`${incoming.origin}/products?${query.toString()}`, scenario);
    if (mocked) return mocked;
  }

  const base = process.env.API_BASE_URL;
  if (!base) return NextResponse.json({ code: 'CONFIGURATION_ERROR', messageAr: 'إعداد الاتصال بالخادم غير مكتمل.', messageEn: 'Server API configuration is missing.', traceId: '', details: {} }, { status: 500 });

  try {
    const upstream = await fetch(`${base.replace(/\/$/, '')}/products?${query.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });
    const body = await upstream.text();
    if (!body.trim()) {
      return NextResponse.json({
        code: 'EMPTY_UPSTREAM_RESPONSE',
        messageAr: 'أعاد الخادم استجابة فارغة بدلًا من بيانات الكتالوج.',
        messageEn: 'The catalog service returned an empty response.',
        traceId: '',
        details: {}
      }, { status: upstream.ok ? 502 : upstream.status });
    }

    return new NextResponse(body, {
      status: upstream.status,
      headers: { 'Content-Type': upstream.headers.get('content-type') ?? 'application/json', 'Cache-Control': 'no-store' }
    });
  } catch {
    return NextResponse.json({ code: 'UPSTREAM_UNAVAILABLE', messageAr: 'تعذر الاتصال بالخادم. حاول مرة أخرى.', messageEn: 'The service is temporarily unavailable.', traceId: '', details: {} }, { status: 502 });
  }
}
