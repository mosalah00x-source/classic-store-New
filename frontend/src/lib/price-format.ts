/**
 * Formats the decimal amount consistently in the catalog and product detail.
 * Currency text is supplied by the caller so the catalog translation remains authoritative.
 */
export function formatPrice(value: string): string {
  return Number(value).toFixed(2);
}
