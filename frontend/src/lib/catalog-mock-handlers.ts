import type { CatalogCategory, ProductPage, ProductSummary } from './catalog-types';

const rootCategory: CatalogCategory = {
  id: '10000000-0000-4000-8000-000000000001',
  parentId: null,
  nameAr: 'الأجهزة المنزلية',
  nameEn: 'Home appliances',
  slug: 'home-appliances',
  sortOrder: 1
};

const childCategory: CatalogCategory = {
  id: '10000000-0000-4000-8000-000000000002',
  parentId: rootCategory.id,
  nameAr: 'أجهزة المطبخ',
  nameEn: 'Kitchen appliances',
  slug: 'kitchen-appliances',
  sortOrder: 1
};

const accessoriesCategory: CatalogCategory = {
  id: '10000000-0000-4000-8000-000000000003',
  parentId: null,
  nameAr: 'الإكسسوارات',
  nameEn: 'Accessories',
  slug: 'accessories',
  sortOrder: 2
};

const products: ProductSummary[] = [
  {
    id: '20000000-0000-4000-8000-000000000001',
    slug: 'classic-blender',
    nameAr: 'خلاط كلاسيك',
    nameEn: 'Classic blender',
    priceFrom: '950.00',
    currency: 'EGP',
    primaryImage: { id: '50000000-0000-4000-8000-000000000001', variantId: null, imageUrl: '/mock/blender.svg', altAr: 'خلاط كلاسيك', sortOrder: 0 },
    brand: { id: '30000000-0000-4000-8000-000000000001', name: 'كلاسيك', slug: 'classic' },
    categories: [rootCategory, childCategory]
  },
  {
    id: '20000000-0000-4000-8000-000000000002',
    slug: 'classic-kettle',
    nameAr: 'غلاية مياه',
    nameEn: null,
    priceFrom: null,
    currency: 'EGP',
    primaryImage: null,
    brand: null,
    categories: [childCategory]
  },
  {
    id: '20000000-0000-4000-8000-000000000003',
    slug: 'classic-toaster',
    nameAr: 'محمصة خبز',
    nameEn: null,
    priceFrom: '725.00',
    currency: 'EGP',
    primaryImage: { id: '50000000-0000-4000-8000-000000000002', variantId: null, imageUrl: '/mock/toaster.svg', altAr: 'محمصة خبز', sortOrder: 0 },
    brand: null,
    categories: [rootCategory]
  }
];

const manyProducts: ProductSummary[] = Array.from({ length: 45 }, (_, index) => {
  const number = index + 1;
  const category = number % 3 === 0 ? accessoriesCategory : number % 2 === 0 ? childCategory : rootCategory;
  const hasImage = number % 7 !== 0;
  const hasPrice = number % 9 !== 0;
  const hasBrand = number % 4 !== 0;
  return {
    id: `21000000-0000-4000-8000-${String(number).padStart(12, '0')}`,
    slug: `demo-product-${number}`,
    nameAr: `منتج تجريبي ${number}`,
    nameEn: `Demo product ${number}`,
    priceFrom: hasPrice ? `${(250 + ((number * 137) % 2400)).toFixed(2)}` : null,
    currency: 'EGP',
    primaryImage: hasImage ? {
      id: `51000000-0000-4000-8000-${String(number).padStart(12, '0')}`,
      variantId: null,
      imageUrl: number % 2 === 0 ? '/mock/blender.svg' : '/mock/toaster.svg',
      altAr: `صورة منتج تجريبي ${number}`,
      sortOrder: 0
    } : null,
    brand: hasBrand ? { id: '30000000-0000-4000-8000-000000000001', name: 'كلاسيك', slug: 'classic' } : null,
    categories: [category]
  };
});

const errorPayload = (code: string, messageAr: string, messageEn: string) => ({
  code,
  messageAr,
  messageEn,
  traceId: '40000000-0000-4000-8000-000000000001',
  details: {}
});

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export function isCatalogMockEnabled(environment: {
  API_MOCKING?: string;
  NODE_ENV?: string;
}): boolean {
  return environment.API_MOCKING === 'true' && environment.NODE_ENV !== 'production';
}

/**
 * Shared deterministic catalog mock used by the route handler and Node tests.
 * It is enabled only outside production when API_MOCKING=true.
 */
export function handleCatalogMock(requestUrl: string, scenario: 'default' | 'many' = 'default'): Response | null {
  const url = new URL(requestUrl);
  const many = scenario === 'many';
  const categories = many ? [rootCategory, childCategory, accessoriesCategory] : [rootCategory, childCategory];
  if (url.pathname === '/categories' && url.search === '') return json(categories);
  if (url.pathname !== '/products') return null;

  const q = url.searchParams.get('q')?.trim() ?? '';
  const categoryId = url.searchParams.get('categoryId') ?? '';
  const minPrice = url.searchParams.get('minPrice');
  const maxPrice = url.searchParams.get('maxPrice');
  const sort = url.searchParams.get('sort') ?? 'newest';
  const page = Number(url.searchParams.get('page') ?? 0);
  const size = Number(url.searchParams.get('size') ?? 20);

  if (q === '__mock_500__') {
    return json(errorPayload('INTERNAL_ERROR', 'حدث خطأ غير متوقع.', 'An unexpected error occurred.'), 500);
  }

  const validMoney = (value: string | null) => value === null || /^\d+\.\d{2}$/.test(value);
  if (
    !validMoney(minPrice) ||
    !validMoney(maxPrice) ||
    (minPrice !== null && maxPrice !== null && Number(minPrice) > Number(maxPrice)) ||
    !Number.isInteger(page) || page < 0 ||
    !Number.isInteger(size) || size < 1 || size > 100 ||
    !['newest', 'priceAsc', 'priceDesc'].includes(sort)
  ) {
    return json(errorPayload('VALIDATION_ERROR', 'بيانات التصفية غير صحيحة.', 'Invalid catalog filters.'), 400);
  }

  const source = many ? manyProducts : products;
  let filtered = source.filter((product) => {
    const matchesQuery = !q || product.nameAr.includes(q);
    const matchesCategory = !categoryId || product.categories.some((category) => category.id === categoryId);
    const price = product.priceFrom === null ? null : Number(product.priceFrom);
    const matchesMin = minPrice === null || (price !== null && price >= Number(minPrice));
    const matchesMax = maxPrice === null || (price !== null && price <= Number(maxPrice));
    return matchesQuery && matchesCategory && matchesMin && matchesMax;
  });

  if (sort === 'priceAsc') filtered = [...filtered].sort((a, b) => Number(a.priceFrom ?? Number.MAX_SAFE_INTEGER) - Number(b.priceFrom ?? Number.MAX_SAFE_INTEGER));
  if (sort === 'priceDesc') filtered = [...filtered].sort((a, b) => Number(b.priceFrom ?? -1) - Number(a.priceFrom ?? -1));

  const totalElements = filtered.length;
  const totalPages = Math.ceil(totalElements / size);
  const body: ProductPage = {
    content: filtered.slice(page * size, (page + 1) * size),
    page,
    size,
    totalElements,
    totalPages
  };
  return json(body);
}
