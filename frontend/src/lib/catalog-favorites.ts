export const FAVORITES_STORAGE_KEY = 'classic-store:favorites:v1';
export const CATALOG_CART_ENABLED = false;
export const CATALOG_PROMOTION_BADGES_ENABLED = false;

type FavoriteStorage = Pick<Storage, 'getItem' | 'setItem'>;

function browserStorage(): FavoriteStorage | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.localStorage;
}

export function readFavoriteIds(storage?: FavoriteStorage): string[] {
  try {
    const source = storage ?? browserStorage();
    if (!source) return [];
    const raw = source.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return [...new Set(parsed.filter((id): id is string => typeof id === 'string' && id.length > 0))];
  } catch {
    return [];
  }
}

export function saveFavoriteIds(ids: string[], storage?: FavoriteStorage): void {
  try {
    const target = storage ?? browserStorage();
    target?.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...new Set(ids)]));
  } catch {
    // Keep the current in-memory selection when browser storage is unavailable.
  }
}

export function toggleFavoriteId(ids: string[], productId: string): string[] {
  return ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId];
}
