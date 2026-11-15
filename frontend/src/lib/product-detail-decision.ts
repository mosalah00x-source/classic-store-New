import type { ProductDetail } from './product-detail-api';
import { ProductDetailRequestError } from './product-detail-api';

export type ProductDetailLoadResult =
  | { ok: true; product: ProductDetail | null }
  | { ok: false; error: unknown };

export type ProductDetailDecision =
  | { kind: 'ok'; product: ProductDetail }
  | { kind: 'notFound' }
  | { kind: 'error'; error: unknown };

export function decideProductDetail(result: ProductDetailLoadResult): ProductDetailDecision {
  if (result.ok) {
    return result.product ? { kind: 'ok', product: result.product } : { kind: 'notFound' };
  }

  if (result.error instanceof ProductDetailRequestError && result.error.status === 404) {
    return { kind: 'notFound' };
  }

  return { kind: 'error', error: result.error };
}
