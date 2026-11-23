import assert from 'node:assert/strict';
import test from 'node:test';
import { getProducts } from '../src/lib/catalog-api';
import { CatalogRequestError } from '../src/lib/catalog-types';
import { getProductDetail, ProductDetailRequestError } from '../src/lib/product-detail-api';

const productPage = {
  content: [],
  page: 0,
  size: 20,
  totalElements: 0,
  totalPages: 0
};

const productDetail = {
  id: 'product-1',
  slug: 'product-1',
  nameAr: 'منتج',
  nameEn: 'Product',
  descriptionAr: null,
  descriptionEn: null,
  brand: null,
  categories: [],
  variants: [],
  images: []
};

async function withMockFetch(
  handler: typeof fetch,
  callback: () => Promise<void>
): Promise<void> {
  const originalFetch = globalThis.fetch;
  const original = {
    API_BASE_URL: process.env.API_BASE_URL,
    API_MOCKING: process.env.API_MOCKING,
    API_MOCK_SCENARIO: process.env.API_MOCK_SCENARIO,
    NODE_ENV: process.env.NODE_ENV
  };
  globalThis.fetch = handler;
  process.env.API_BASE_URL = 'https://api.example.invalid';
  process.env.API_MOCKING = 'false';
  process.env.API_MOCK_SCENARIO = '';
  process.env.NODE_ENV = 'test';

  try {
    await callback();
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

const emptyResponse = (status: number) => new Response(null, { status });
const invalidResponse = () => new Response('{not-json', { status: 200 });
const successResponse = (body: unknown) => new Response(JSON.stringify(body), {
  status: 200,
  headers: { 'Content-Type': 'application/json' }
});

test('catalog API classifies empty 200 as CatalogRequestError', async () => {
  await withMockFetch(async () => emptyResponse(200), async () => {
    await assert.rejects(getProducts(), (error: unknown) => error instanceof CatalogRequestError && error.status === 200);
  });
});

test('catalog API classifies empty 500 as CatalogRequestError', async () => {
  await withMockFetch(async () => emptyResponse(500), async () => {
    await assert.rejects(getProducts(), (error: unknown) => error instanceof CatalogRequestError && error.status === 500);
  });
});

test('catalog API classifies invalid JSON as CatalogRequestError', async () => {
  await withMockFetch(async () => invalidResponse(), async () => {
    await assert.rejects(getProducts(), (error: unknown) => error instanceof CatalogRequestError && error.status === 200);
  });
});

test('catalog API classifies 204 as an empty-response error', async () => {
  await withMockFetch(async () => emptyResponse(204), async () => {
    await assert.rejects(getProducts(), (error: unknown) => error instanceof CatalogRequestError && error.status === 204);
  });
});

test('catalog API classifies network failure as CatalogRequestError', async () => {
  await withMockFetch(async () => { throw new TypeError('Network failure'); }, async () => {
    await assert.rejects(getProducts(), (error: unknown) => error instanceof CatalogRequestError && error.status === 0);
  });
});

test('catalog API preserves a normal successful JSON response', async () => {
  await withMockFetch(async () => successResponse(productPage), async () => {
    assert.deepEqual(await getProducts(), productPage);
  });
});

test('product detail API classifies empty 200 as ProductDetailRequestError', async () => {
  await withMockFetch(async () => emptyResponse(200), async () => {
    await assert.rejects(
      getProductDetail('product-1', { API_BASE_URL: 'https://api.example.invalid', API_MOCKING: 'false', NODE_ENV: 'test' }),
      (error: unknown) => error instanceof ProductDetailRequestError && error.status === 200
    );
  });
});

test('product detail API classifies empty 500 as ProductDetailRequestError', async () => {
  await withMockFetch(async () => emptyResponse(500), async () => {
    await assert.rejects(
      getProductDetail('product-1', { API_BASE_URL: 'https://api.example.invalid', API_MOCKING: 'false', NODE_ENV: 'test' }),
      (error: unknown) => error instanceof ProductDetailRequestError && error.status === 500
    );
  });
});

test('product detail API classifies invalid JSON as ProductDetailRequestError', async () => {
  await withMockFetch(async () => invalidResponse(), async () => {
    await assert.rejects(
      getProductDetail('product-1', { API_BASE_URL: 'https://api.example.invalid', API_MOCKING: 'false', NODE_ENV: 'test' }),
      (error: unknown) => error instanceof ProductDetailRequestError && error.status === 200
    );
  });
});

test('product detail API classifies 204 as an empty-response error', async () => {
  await withMockFetch(async () => emptyResponse(204), async () => {
    await assert.rejects(
      getProductDetail('product-1', { API_BASE_URL: 'https://api.example.invalid', API_MOCKING: 'false', NODE_ENV: 'test' }),
      (error: unknown) => error instanceof ProductDetailRequestError && error.status === 204
    );
  });
});

test('product detail API classifies network failure as ProductDetailRequestError', async () => {
  await withMockFetch(async () => { throw new TypeError('Network failure'); }, async () => {
    await assert.rejects(
      getProductDetail('product-1', { API_BASE_URL: 'https://api.example.invalid', API_MOCKING: 'false', NODE_ENV: 'test' }),
      (error: unknown) => error instanceof ProductDetailRequestError && error.status === 0
    );
  });
});

test('product detail API preserves a normal successful JSON response', async () => {
  await withMockFetch(async () => successResponse(productDetail), async () => {
    assert.deepEqual(
      await getProductDetail('product-1', { API_BASE_URL: 'https://api.example.invalid', API_MOCKING: 'false', NODE_ENV: 'test' }),
      productDetail
    );
  });
});

test('catalog API keeps the showcase mock scenario local and unchanged', async () => {
  await withMockFetch(async () => { throw new Error('showcase mock must not call fetch'); }, async () => {
    process.env.API_MOCKING = 'true';
    process.env.API_MOCK_SCENARIO = 'showcase';

    const page = await getProducts();
    assert.equal(page.size, 10);
    assert.equal(page.totalElements, 18);
    const { getCategories } = await import('../src/lib/catalog-api');
    assert.equal((await getCategories()).length, 9);
  });
});
