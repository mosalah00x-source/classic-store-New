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

const showcaseCategories: CatalogCategory[] = [
  {
    "id": "10000000-0000-4000-8000-000000000101",
    "parentId": null,
    "nameAr": "كرافت",
    "nameEn": null,
    "slug": "ties",
    "sortOrder": 1
  },
  {
    "id": "10000000-0000-4000-8000-000000000102",
    "parentId": null,
    "nameAr": "أحزمة",
    "nameEn": null,
    "slug": "belts",
    "sortOrder": 2
  },
  {
    "id": "10000000-0000-4000-8000-000000000103",
    "parentId": null,
    "nameAr": "طقم (كرافت وسكارف ومنديل)",
    "nameEn": null,
    "slug": "sets-tie-scarf-handkerchief",
    "sortOrder": 3
  },
  {
    "id": "10000000-0000-4000-8000-000000000104",
    "parentId": null,
    "nameAr": "أزرار أكمام",
    "nameEn": null,
    "slug": "cufflinks",
    "sortOrder": 4
  },
  {
    "id": "10000000-0000-4000-8000-000000000105",
    "parentId": null,
    "nameAr": "ربطة أسكوت",
    "nameEn": null,
    "slug": "ascot-ties",
    "sortOrder": 5
  },
  {
    "id": "10000000-0000-4000-8000-000000000106",
    "parentId": null,
    "nameAr": "حزام وسط بالبابيون",
    "nameEn": null,
    "slug": "cummerbunds",
    "sortOrder": 6
  },
  {
    "id": "10000000-0000-4000-8000-000000000107",
    "parentId": null,
    "nameAr": "سكارفات",
    "nameEn": null,
    "slug": "scarves",
    "sortOrder": 7
  },
  {
    "id": "10000000-0000-4000-8000-000000000108",
    "parentId": null,
    "nameAr": "قبعات",
    "nameEn": null,
    "slug": "caps",
    "sortOrder": 8
  },
  {
    "id": "10000000-0000-4000-8000-000000000109",
    "parentId": null,
    "nameAr": "منديل جيب",
    "nameEn": null,
    "slug": "pocket-squares",
    "sortOrder": 9
  }
];

// Local showcase category links are inferred from product names and prototype sections; they are not real API category assignments.
const showcaseProducts: ProductSummary[] = [
  {
    "id": "22000000-0000-4000-8000-000000000001",
    "slug": "showcase-tie-floral-85",
    "nameAr": "ربطة عنق مايكروفايبر سوبر بنقش ورد - عرض 8.5 سم",
    "nameEn": null,
    "priceFrom": "712.50",
    "currency": "EGP",
    "primaryImage": {
      "id": "52000000-0000-4000-8000-000000000001",
      "variantId": null,
      "imageUrl": "/mock/showcase-placeholder.svg",
      "altAr": "ربطة عنق مايكروفايبر سوبر بنقش ورد - عرض 8.5 سم",
      "sortOrder": 0
    },
    "brand": null,
    "categories": [
      {
        "id": "10000000-0000-4000-8000-000000000101",
        "parentId": null,
        "nameAr": "كرافت",
        "nameEn": null,
        "slug": "ties",
        "sortOrder": 1
      }
    ]
  },
  {
    "id": "22000000-0000-4000-8000-000000000002",
    "slug": "showcase-tie-dotted-85",
    "nameAr": "ربطة عنق مايكروفايبر سوبر منقطة - عرض 8.5 سم",
    "nameEn": null,
    "priceFrom": "712.50",
    "currency": "EGP",
    "primaryImage": {
      "id": "52000000-0000-4000-8000-000000000002",
      "variantId": null,
      "imageUrl": "/mock/showcase-placeholder.svg",
      "altAr": "ربطة عنق مايكروفايبر سوبر منقطة - عرض 8.5 سم",
      "sortOrder": 0
    },
    "brand": null,
    "categories": [
      {
        "id": "10000000-0000-4000-8000-000000000101",
        "parentId": null,
        "nameAr": "كرافت",
        "nameEn": null,
        "slug": "ties",
        "sortOrder": 1
      }
    ]
  },
  {
    "id": "22000000-0000-4000-8000-000000000003",
    "slug": "showcase-tie-paisley-handkerchief-7",
    "nameAr": "ربطة عنق مايكروفايبر بيزلي مع منديل - عرض 7 سم",
    "nameEn": null,
    "priceFrom": "375.00",
    "currency": "EGP",
    "primaryImage": {
      "id": "52000000-0000-4000-8000-000000000003",
      "variantId": null,
      "imageUrl": "/mock/showcase-placeholder.svg",
      "altAr": "ربطة عنق مايكروفايبر بيزلي مع منديل - عرض 7 سم",
      "sortOrder": 0
    },
    "brand": null,
    "categories": [
      {
        "id": "10000000-0000-4000-8000-000000000101",
        "parentId": null,
        "nameAr": "كرافت",
        "nameEn": null,
        "slug": "ties",
        "sortOrder": 1
      }
    ]
  },
  {
    "id": "22000000-0000-4000-8000-000000000004",
    "slug": "showcase-tie-natural-handkerchief-7",
    "nameAr": "ربطة عنق مايكروفايبر طبيعية مع منديل - عرض 7 سم",
    "nameEn": null,
    "priceFrom": "175.00",
    "currency": "EGP",
    "primaryImage": {
      "id": "52000000-0000-4000-8000-000000000004",
      "variantId": null,
      "imageUrl": "/mock/showcase-placeholder.svg",
      "altAr": "ربطة عنق مايكروفايبر طبيعية مع منديل - عرض 7 سم",
      "sortOrder": 0
    },
    "brand": null,
    "categories": [
      {
        "id": "10000000-0000-4000-8000-000000000101",
        "parentId": null,
        "nameAr": "كرافت",
        "nameEn": null,
        "slug": "ties",
        "sortOrder": 1
      }
    ]
  },
  {
    "id": "22000000-0000-4000-8000-000000000005",
    "slug": "showcase-reversible-wool-scarf-brown",
    "nameAr": "Reversible Wool Scarf – Brown",
    "nameEn": null,
    "priceFrom": "440.00",
    "currency": "EGP",
    "primaryImage": {
      "id": "52000000-0000-4000-8000-000000000005",
      "variantId": null,
      "imageUrl": "/mock/showcase-placeholder.svg",
      "altAr": "Reversible Wool Scarf – Brown",
      "sortOrder": 0
    },
    "brand": null,
    "categories": [
      {
        "id": "10000000-0000-4000-8000-000000000107",
        "parentId": null,
        "nameAr": "سكارفات",
        "nameEn": null,
        "slug": "scarves",
        "sortOrder": 7
      }
    ]
  },
  {
    "id": "22000000-0000-4000-8000-000000000006",
    "slug": "showcase-tie-dotted-7",
    "nameAr": "ربطة عنق مايكروفايبر سوبر بنقش منقط - وسط 7 سم",
    "nameEn": null,
    "priceFrom": "675.00",
    "currency": "EGP",
    "primaryImage": {
      "id": "52000000-0000-4000-8000-000000000006",
      "variantId": null,
      "imageUrl": "/mock/showcase-placeholder.svg",
      "altAr": "ربطة عنق مايكروفايبر سوبر بنقش منقط - وسط 7 سم",
      "sortOrder": 0
    },
    "brand": null,
    "categories": [
      {
        "id": "10000000-0000-4000-8000-000000000101",
        "parentId": null,
        "nameAr": "كرافت",
        "nameEn": null,
        "slug": "ties",
        "sortOrder": 1
      }
    ]
  },
  {
    "id": "22000000-0000-4000-8000-000000000007",
    "slug": "showcase-tie-paisley-7",
    "nameAr": "ربطة عنق مايكروفايبر سوبر بنقش بيزلى - وسط 7 سم",
    "nameEn": null,
    "priceFrom": "400.00",
    "currency": "EGP",
    "primaryImage": {
      "id": "52000000-0000-4000-8000-000000000007",
      "variantId": null,
      "imageUrl": "/mock/showcase-placeholder.svg",
      "altAr": "ربطة عنق مايكروفايبر سوبر بنقش بيزلى - وسط 7 سم",
      "sortOrder": 0
    },
    "brand": null,
    "categories": [
      {
        "id": "10000000-0000-4000-8000-000000000101",
        "parentId": null,
        "nameAr": "كرافت",
        "nameEn": null,
        "slug": "ties",
        "sortOrder": 1
      }
    ]
  },
  {
    "id": "22000000-0000-4000-8000-000000000008",
    "slug": "showcase-tie-floral-7",
    "nameAr": "ربطة عنق مايكروفايبر سوبر بنقش ورد - وسط 7 سم",
    "nameEn": null,
    "priceFrom": "400.00",
    "currency": "EGP",
    "primaryImage": {
      "id": "52000000-0000-4000-8000-000000000008",
      "variantId": null,
      "imageUrl": "/mock/showcase-placeholder.svg",
      "altAr": "ربطة عنق مايكروفايبر سوبر بنقش ورد - وسط 7 سم",
      "sortOrder": 0
    },
    "brand": null,
    "categories": [
      {
        "id": "10000000-0000-4000-8000-000000000101",
        "parentId": null,
        "nameAr": "كرافت",
        "nameEn": null,
        "slug": "ties",
        "sortOrder": 1
      }
    ]
  },
  {
    "id": "22000000-0000-4000-8000-000000000009",
    "slug": "showcase-paisley-jacquard-scarf-tie-set",
    "nameAr": "اسكارف مع كرافتة جاكار بنقشة بيزلي مع منديل جيب",
    "nameEn": null,
    "priceFrom": "920.00",
    "currency": "EGP",
    "primaryImage": {
      "id": "52000000-0000-4000-8000-000000000009",
      "variantId": null,
      "imageUrl": "/mock/showcase-placeholder.svg",
      "altAr": "اسكارف مع كرافتة جاكار بنقشة بيزلي مع منديل جيب",
      "sortOrder": 0
    },
    "brand": null,
    "categories": [
      {
        "id": "10000000-0000-4000-8000-000000000103",
        "parentId": null,
        "nameAr": "طقم (كرافت وسكارف ومنديل)",
        "nameEn": null,
        "slug": "sets-tie-scarf-handkerchief",
        "sortOrder": 3
      }
    ]
  },
  {
    "id": "22000000-0000-4000-8000-000000000010",
    "slug": "showcase-tie-scattered-85",
    "nameAr": "ربطة عنق مايكروفايبر سوبر متناثرة - عرض 8.5 سم",
    "nameEn": null,
    "priceFrom": "712.50",
    "currency": "EGP",
    "primaryImage": {
      "id": "52000000-0000-4000-8000-000000000010",
      "variantId": null,
      "imageUrl": "/mock/showcase-placeholder.svg",
      "altAr": "ربطة عنق مايكروفايبر سوبر متناثرة - عرض 8.5 سم",
      "sortOrder": 0
    },
    "brand": null,
    "categories": [
      {
        "id": "10000000-0000-4000-8000-000000000101",
        "parentId": null,
        "nameAr": "كرافت",
        "nameEn": null,
        "slug": "ties",
        "sortOrder": 1
      }
    ]
  },
  {
    "id": "22000000-0000-4000-8000-000000000011",
    "slug": "showcase-tie-geometric-85",
    "nameAr": "ربطة عنق مايكروفايبر سوبر هندسية - عرض 8.5 سم",
    "nameEn": null,
    "priceFrom": "712.50",
    "currency": "EGP",
    "primaryImage": {
      "id": "52000000-0000-4000-8000-000000000011",
      "variantId": null,
      "imageUrl": "/mock/showcase-placeholder.svg",
      "altAr": "ربطة عنق مايكروفايبر سوبر هندسية - عرض 8.5 سم",
      "sortOrder": 0
    },
    "brand": null,
    "categories": [
      {
        "id": "10000000-0000-4000-8000-000000000101",
        "parentId": null,
        "nameAr": "كرافت",
        "nameEn": null,
        "slug": "ties",
        "sortOrder": 1
      }
    ]
  },
  {
    "id": "22000000-0000-4000-8000-000000000012",
    "slug": "showcase-black-leather-automatic-belt",
    "nameAr": "حزام رجالي أسود من الجلد الطبيعي مع توكه أوتوماتيك",
    "nameEn": null,
    "priceFrom": "480.00",
    "currency": "EGP",
    "primaryImage": {
      "id": "52000000-0000-4000-8000-000000000012",
      "variantId": null,
      "imageUrl": "/mock/showcase-placeholder.svg",
      "altAr": "حزام رجالي أسود من الجلد الطبيعي مع توكه أوتوماتيك",
      "sortOrder": 0
    },
    "brand": null,
    "categories": [
      {
        "id": "10000000-0000-4000-8000-000000000102",
        "parentId": null,
        "nameAr": "أحزمة",
        "nameEn": null,
        "slug": "belts",
        "sortOrder": 2
      }
    ]
  },
  {
    "id": "22000000-0000-4000-8000-000000000013",
    "slug": "showcase-camel-leather-automatic-belt",
    "nameAr": "حزام رجالي جملي من الجلد الطبيعي مع توكه أوتوماتيك",
    "nameEn": null,
    "priceFrom": "480.00",
    "currency": "EGP",
    "primaryImage": {
      "id": "52000000-0000-4000-8000-000000000013",
      "variantId": null,
      "imageUrl": "/mock/showcase-placeholder.svg",
      "altAr": "حزام رجالي جملي من الجلد الطبيعي مع توكه أوتوماتيك",
      "sortOrder": 0
    },
    "brand": null,
    "categories": [
      {
        "id": "10000000-0000-4000-8000-000000000102",
        "parentId": null,
        "nameAr": "أحزمة",
        "nameEn": null,
        "slug": "belts",
        "sortOrder": 2
      }
    ]
  },
  {
    "id": "22000000-0000-4000-8000-000000000014",
    "slug": "showcase-wool-grey-flat-cap",
    "nameAr": "Wool Grey Flat cap",
    "nameEn": null,
    "priceFrom": "340.00",
    "currency": "EGP",
    "primaryImage": {
      "id": "52000000-0000-4000-8000-000000000014",
      "variantId": null,
      "imageUrl": "/mock/showcase-placeholder.svg",
      "altAr": "Wool Grey Flat cap",
      "sortOrder": 0
    },
    "brand": null,
    "categories": [
      {
        "id": "10000000-0000-4000-8000-000000000108",
        "parentId": null,
        "nameAr": "قبعات",
        "nameEn": null,
        "slug": "caps",
        "sortOrder": 8
      }
    ]
  },
  {
    "id": "22000000-0000-4000-8000-000000000015",
    "slug": "showcase-dotted-ascot-tie",
    "nameAr": "ربطة أسكوت منقطة",
    "nameEn": null,
    "priceFrom": "350.00",
    "currency": "EGP",
    "primaryImage": {
      "id": "52000000-0000-4000-8000-000000000015",
      "variantId": null,
      "imageUrl": "/mock/showcase-placeholder.svg",
      "altAr": "ربطة أسكوت منقطة",
      "sortOrder": 0
    },
    "brand": null,
    "categories": [
      {
        "id": "10000000-0000-4000-8000-000000000105",
        "parentId": null,
        "nameAr": "ربطة أسكوت",
        "nameEn": null,
        "slug": "ascot-ties",
        "sortOrder": 5
      }
    ]
  },
  {
    "id": "22000000-0000-4000-8000-000000000016",
    "slug": "showcase-tie-pocket-square-set",
    "nameAr": "طقم كرافت مع منديل جيب",
    "nameEn": null,
    "priceFrom": "920.00",
    "currency": "EGP",
    "primaryImage": {
      "id": "52000000-0000-4000-8000-000000000016",
      "variantId": null,
      "imageUrl": "/mock/showcase-placeholder.svg",
      "altAr": "طقم كرافت مع منديل جيب",
      "sortOrder": 0
    },
    "brand": null,
    "categories": [
      {
        "id": "10000000-0000-4000-8000-000000000103",
        "parentId": null,
        "nameAr": "طقم (كرافت وسكارف ومنديل)",
        "nameEn": null,
        "slug": "sets-tie-scarf-handkerchief",
        "sortOrder": 3
      }
    ]
  },
  {
    "id": "22000000-0000-4000-8000-000000000017",
    "slug": "showcase-classic-dotted-tie",
    "nameAr": "ربطة عنق كلاسيك منقطة",
    "nameEn": null,
    "priceFrom": "300.00",
    "currency": "EGP",
    "primaryImage": {
      "id": "52000000-0000-4000-8000-000000000017",
      "variantId": null,
      "imageUrl": "/mock/showcase-placeholder.svg",
      "altAr": "ربطة عنق كلاسيك منقطة",
      "sortOrder": 0
    },
    "brand": null,
    "categories": [
      {
        "id": "10000000-0000-4000-8000-000000000101",
        "parentId": null,
        "nameAr": "كرافت",
        "nameEn": null,
        "slug": "ties",
        "sortOrder": 1
      }
    ]
  },
  {
    "id": "22000000-0000-4000-8000-000000000018",
    "slug": "showcase-navy-jacquard-tie",
    "nameAr": "ربطة عنق جاكار كحلي",
    "nameEn": null,
    "priceFrom": "380.00",
    "currency": "EGP",
    "primaryImage": {
      "id": "52000000-0000-4000-8000-000000000018",
      "variantId": null,
      "imageUrl": "/mock/showcase-placeholder.svg",
      "altAr": "ربطة عنق جاكار كحلي",
      "sortOrder": 0
    },
    "brand": null,
    "categories": [
      {
        "id": "10000000-0000-4000-8000-000000000101",
        "parentId": null,
        "nameAr": "كرافت",
        "nameEn": null,
        "slug": "ties",
        "sortOrder": 1
      }
    ]
  }
];

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
export function handleCatalogMock(requestUrl: string, scenario: 'default' | 'many' | 'showcase' = 'default'): Response | null {
  const url = new URL(requestUrl);
  const many = scenario === 'many';
  const categories = scenario === 'showcase' ? showcaseCategories : many ? [rootCategory, childCategory, accessoriesCategory] : [rootCategory, childCategory];
  if (url.pathname === '/categories' && url.search === '') return json(categories);
  if (url.pathname !== '/products') return null;

  const q = url.searchParams.get('q')?.trim() ?? '';
  const categoryId = url.searchParams.get('categoryId') ?? '';
  const minPrice = url.searchParams.get('minPrice');
  const maxPrice = url.searchParams.get('maxPrice');
  const sort = url.searchParams.get('sort') ?? 'newest';
  const page = Number(url.searchParams.get('page') ?? 0);
  const size = Number(url.searchParams.get('size') ?? (scenario === 'showcase' ? 10 : 20));

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

  const source = scenario === 'showcase' ? showcaseProducts : many ? manyProducts : products;
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
