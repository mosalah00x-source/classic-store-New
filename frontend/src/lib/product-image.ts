import type { SyntheticEvent } from 'react';

export const PRODUCT_IMAGE_PLACEHOLDER = '/mock/product-placeholder.svg';

export function onProductImageError(
  event: SyntheticEvent<HTMLImageElement>,
  fallbackAlt: string
): void {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === 'true') {
    image.hidden = true;
    return;
  }
  image.dataset.fallbackApplied = 'true';
  image.src = PRODUCT_IMAGE_PLACEHOLDER;
  image.alt = fallbackAlt;
}
