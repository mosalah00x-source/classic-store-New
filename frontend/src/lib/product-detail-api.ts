import { handleCatalogMock, isCatalogMockEnabled } from './catalog-mock-handlers';
import type { ProductPage } from './catalog-types';

export type ProductDetailBrand = { id: string; name: string; slug: string };
export type ProductDetailCategory = {
  id: string; parentId: string | null; nameAr: string; nameEn: string | null; slug: string; sortOrder: number;
};
export type ProductDetailVariant = {
  id: string; sku: string; titleAr: string | null; attributes: Record<string, unknown>; price: string; currency: 'EGP';
};
export type ProductDetailImage = {
  id: string; variantId: string | null; imageUrl: string; altAr: string | null; sortOrder: number;
};
export type ProductDetail = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string | null;
  descriptionAr: string | null;
  descriptionEn: string | null;
  brand: ProductDetailBrand | null;
  categories: ProductDetailCategory[];
  variants: ProductDetailVariant[];
  images: ProductDetailImage[];
  oldPrice?: string | null;
  discountPercent?: number | null;
};

export type ProductDetailApiError = {
  code: string;
  messageAr: string;
  messageEn: string;
  traceId: string;
  details: Record<string, unknown>;
};

export class ProductDetailRequestError extends Error {
  constructor(message: string, public readonly status: number, public readonly payload?: ProductDetailApiError) {
    super(message);
    this.name = 'ProductDetailRequestError';
  }
}

const mockCategory: ProductDetailCategory = {
  id: '10000000-0000-4000-8000-000000000002',
  parentId: '10000000-0000-4000-8000-000000000001',
  nameAr: 'أجهزة المطبخ',
  nameEn: 'Kitchen appliances',
  slug: 'kitchen-appliances',
  sortOrder: 1
};

const mockBrand: ProductDetailBrand = {
  id: '30000000-0000-4000-8000-000000000001',
  name: 'كلاسيك',
  slug: 'classic'
};

export const mockProductDetails: Record<string, ProductDetail> = {
  'classic-blender': {
    id: '20000000-0000-4000-8000-000000000001',
    slug: 'classic-blender',
    nameAr: 'خلاط كلاسيك',
    nameEn: 'Classic blender',
    descriptionAr: 'خلاط عملي لتحضير العصائر والمكونات اليومية بسهولة.',
    descriptionEn: 'A practical blender for everyday drinks and food preparation.',
    brand: mockBrand,
    categories: [mockCategory],
    variants: [
      { id: '40000000-0000-4000-8000-000000000001', sku: 'CL-BL-500', titleAr: '500 وات', attributes: { power: '500 وات', color: 'أبيض' }, price: '950.00', currency: 'EGP' },
      { id: '40000000-0000-4000-8000-000000000002', sku: 'CL-BL-700', titleAr: '700 وات', attributes: { power: '700 وات', color: 'أسود' }, price: '1250.00', currency: 'EGP' }
    ],
    images: [
      { id: '50000000-0000-4000-8000-000000000001', variantId: null, imageUrl: '/mock/blender.svg', altAr: 'خلاط كلاسيك من الأمام', sortOrder: 0 },
      { id: '50000000-0000-4000-8000-000000000002', variantId: '40000000-0000-4000-8000-000000000002', imageUrl: '/mock/blender.svg', altAr: 'خلاط كلاسيك باللون الأسود', sortOrder: 1 }
    ]
  }
};


// Local-only showcase detail fixtures. Every SKU is synthetic because the
// prototype's v-product panel hardcodes WOOL0010 as shared sample text; it is
// not a per-product data-sku and store.js does not replace it when products change.


async function getShowcaseProductDetail(slug: string): Promise<ProductDetail> {
  const response = handleCatalogMock('https://catalog.invalid/products?page=0&size=100', 'showcase');
  if (!response) throw new ProductDetailRequestError('المنتج غير موجود.', 404);

  const page = (await response.json()) as ProductPage;
  const index = page.content.findIndex((product) => product.slug === slug);
  const product = page.content[index];
  if (!product) throw new ProductDetailRequestError('المنتج غير موجود.', 404);
  if (product.priceFrom === null) {
    throw new ProductDetailRequestError('سعر المنتج غير متاح في بيانات العرض المحلي.', 500);
  }

  // All 18 showcase SKUs are synthetic local-display identifiers (SHOWCASE-01..18).
  const sku = `SHOWCASE-${String(index + 1).padStart(2, '0')}`;
  const imageCount = index === 0 ? 4 : 1;
  const imageUrl = product.primaryImage?.imageUrl ?? '/mock/showcase-placeholder.svg';
  const imageAlt = product.primaryImage?.altAr ?? product.nameAr;

  return {
    id: product.id,
    slug: product.slug,
    nameAr: product.nameAr,
    nameEn: product.nameEn,
    // This copy is hardcoded in the shared prototype v-product template.
    // Keep it only on the scarf fixture; it is template text, not verified product copy.
    descriptionAr: product.slug === 'showcase-reversible-wool-scarf-brown'
      ? 'اسكارفاتنا مناسبة لجميع المناسبات، سواء كانت مناسبة رسمية أو خروجة كاجوال. مصنوعة من خامات عالية الجودة، تم تصميمها لتمنحك الدفء والأناقة في نفس الوقت. اختر من مجموعة واسعة من النقشات والألوان لتجد الاسكارف المثالي لك. احصل على اسكارفك الآن عبر الإنترنت أو قم بزيارة فروعنا!'
      : null,
    descriptionEn: null,
    brand: null,
    categories: product.categories.map((category) => ({ ...category })),
    variants: [
      {
        id: `42000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`,
        sku,
        titleAr: null,
        attributes: {},
        price: product.priceFrom,
        currency: 'EGP'
      }
    ],
    // The first showcase product has four copies of the shared placeholder
    // for thumbnail-gallery review; every other product has one image.
    images: Array.from({ length: imageCount }, (_, imageIndex) => ({
      id: `53000000-0000-4000-8000-${String(index * 4 + imageIndex + 1).padStart(12, '0')}`,
      variantId: null,
      imageUrl,
      altAr: imageAlt,
      sortOrder: imageIndex
    }))
  };
}

function apiBaseUrl(): string {
  const value = process.env.API_BASE_URL;
  if (!value) throw new Error('API_BASE_URL must be configured on the server');
  return value.replace(/\/$/, '');
}

export async function getProductDetail(
  slug: string,
  environment: { API_BASE_URL?: string; API_MOCKING?: string; API_MOCK_SCENARIO?: string; NODE_ENV?: string } = process.env
): Promise<ProductDetail> {
  if (isCatalogMockEnabled(environment)) {
    if (environment.API_MOCK_SCENARIO === 'showcase') return getShowcaseProductDetail(slug);
    const mocked = mockProductDetails[slug];
    if (!mocked) throw new ProductDetailRequestError('المنتج غير موجود.', 404);
    return mocked;
  }

  const baseUrl = environment.API_BASE_URL?.replace(/\/$/, '') ?? apiBaseUrl();
  const response = await fetch(`${baseUrl}/products/${encodeURIComponent(slug)}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store'
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => undefined)) as ProductDetailApiError | undefined;
    throw new ProductDetailRequestError(
      payload?.messageAr ?? (response.status === 404 ? 'المنتج غير موجود.' : 'تعذر تحميل تفاصيل المنتج.'),
      response.status,
      payload
    );
  }

  return (await response.json()) as ProductDetail;
}
