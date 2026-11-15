export type Money = string;

export type CatalogImage = {
  imageUrl: string;
  altAr: string;
};

export type CatalogBrand = {
  id: string;
  name: string;
  slug: string;
};

export type CatalogCategory = {
  id: string;
  parentId: string | null;
  nameAr: string;
  nameEn: string | null;
  slug: string;
  sortOrder: number;
};

export type ProductSummary = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string | null;
  priceFrom: Money | null;
  currency: 'EGP';
  primaryImage: CatalogImage | null;
  brand: CatalogBrand | null;
  categories: CatalogCategory[];
};

export type ProductPage = {
  content: ProductSummary[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type CatalogFilters = {
  q?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: Money;
  maxPrice?: Money;
  sort?: 'newest' | 'priceAsc' | 'priceDesc';
  page?: number;
  size?: number;
};

export type CatalogApiError = {
  code: string;
  messageAr: string;
  messageEn: string;
  traceId: string;
  details: Record<string, unknown>;
};

export class CatalogRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: CatalogApiError
  ) {
    super(message);
    this.name = 'CatalogRequestError';
  }
}
