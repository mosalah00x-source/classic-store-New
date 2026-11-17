/**
 * Formats valid decimal amounts consistently in the catalog and product detail.
 * Invalid input is preserved so formatting never turns missing or malformed data into NaN.
 * Currency text is supplied by the caller so the catalog translation remains authoritative.
 */
export function formatPrice(value: string | null | undefined): string {
  if (value == null || value.trim() === '') return value ?? '';

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue.toFixed(2) : value;
}
