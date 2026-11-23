import type { CatalogCategory, CatalogFilters, ProductPage } from './catalog-types';
import { CatalogRequestError, type CatalogApiError } from './catalog-types';
import { handleCatalogMock, isCatalogMockEnabled } from './catalog-mock-handlers';
import { readJsonResponse } from './safe-json';

function apiBaseUrl(): string {
  const value = process.env.API_BASE_URL;
  if (!value) throw new CatalogRequestError('تعذر تحميل بيانات الكتالوج.', 0);
  return value.replace(/\/$/, '');
}

function toSearchParams(filters: CatalogFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.categoryId) params.set('categoryId', filters.categoryId);
  if (filters.brandId) params.set('brandId', filters.brandId);
  if (filters.minPrice) params.set('minPrice', filters.minPrice);
  if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
  if (filters.sort && filters.sort !== 'newest') params.set('sort', filters.sort);
  params.set('page', String(filters.page ?? 0));
  params.set('size', String(filters.size ?? 20));
  return params;
}

async function catalogRequest<T>(path: string): Promise<T> {
  if (isCatalogMockEnabled(process.env)) {
    const scenario = process.env.API_MOCK_SCENARIO === 'many' ? 'many' : process.env.API_MOCK_SCENARIO === 'showcase' ? 'showcase' : 'default';
    const mocked = handleCatalogMock(new URL(path, apiBaseUrl()).toString(), scenario);
    if (mocked) {
      if (!mocked.ok) {
        const payload = await readJsonResponse<CatalogApiError>(mocked);
        throw new CatalogRequestError(payload?.messageAr ?? 'تعذر تحميل بيانات الكتالوج.', mocked.status, payload);
      }
      const data = await readJsonResponse<T>(mocked);
      if (data === undefined || data === null) {
        throw new CatalogRequestError('تعذر تحميل بيانات الكتالوج.', mocked.status);
      }
      return data;
    }
  }

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl()}${path}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    });
  } catch {
    throw new CatalogRequestError('تعذر تحميل بيانات الكتالوج.', 0);
  }

  if (!response.ok) {
    const payload = await readJsonResponse<CatalogApiError>(response);
    throw new CatalogRequestError(
      payload?.messageAr ?? 'تعذر تحميل بيانات الكتالوج.',
      response.status,
      payload
    );
  }

  const data = await readJsonResponse<T>(response);
  if (data === undefined || data === null) {
    throw new CatalogRequestError('تعذر تحميل بيانات الكتالوج.', response.status);
  }
  return data;
}

export function getProducts(filters: CatalogFilters = {}): Promise<ProductPage> {
  const requestFilters = process.env.API_MOCK_SCENARIO === 'showcase' ? { ...filters, size: 10 } : filters;
  return catalogRequest<ProductPage>(`/products?${toSearchParams(requestFilters).toString()}`);
}

export function getCategories(): Promise<CatalogCategory[]> {
  return catalogRequest<CatalogCategory[]>('/categories');
}

type CategoryNode = CatalogCategory & { children: CategoryNode[] };

export function buildCategoryTree(categories: CatalogCategory[]): CategoryNode[] {
  const byId = new Map(categories.map((category) => [category.id, { ...category, children: [] as CategoryNode[] }]));
  const roots: CategoryNode[] = [];

  for (const category of categories) {
    const node = byId.get(category.id);
    if (!node) continue;
    const parent = category.parentId ? byId.get(category.parentId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }

  const sortTree = (nodes: CategoryNode[]) => {
    nodes.sort((a, b) => a.sortOrder - b.sortOrder || a.nameAr.localeCompare(b.nameAr, 'ar'));
    nodes.forEach((node) => sortTree(node.children));
  };
  sortTree(roots);
  return roots;
}
