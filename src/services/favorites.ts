const FAV_KEY_PREFIX = 'ivy_favorites_';

export function getFavorites(userEmail: string): string[] {
  try {
    const raw = localStorage.getItem(FAV_KEY_PREFIX + userEmail);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavorite(userEmail: string, listingId: string): string[] {
  const current = getFavorites(userEmail);
  let updated: string[];
  if (current.includes(listingId)) {
    updated = current.filter(id => id !== listingId);
  } else {
    updated = [...current, listingId];
  }
  localStorage.setItem(FAV_KEY_PREFIX + userEmail, JSON.stringify(updated));
  return updated;
}

export function isFavorite(userEmail: string, listingId: string): boolean {
  return getFavorites(userEmail).includes(listingId);
}
