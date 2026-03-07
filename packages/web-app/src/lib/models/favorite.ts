
export interface FavoriteItem {
  lieuId: number;
  crossingPointIndex?: number;
}

export const favoriteKey = (favorite: FavoriteItem): string => {
  return `${favorite.lieuId}:${typeof favorite.crossingPointIndex === 'number' ? favorite.crossingPointIndex : '-'}`;
};

export const favoriteMatches = (
  favorite: FavoriteItem,
  lieuId?: number | null,
  crossingPointIndex?: number | null
): boolean => {
  if (typeof lieuId !== 'number') return false;
  if (favorite.lieuId !== lieuId) return false;

  const favoriteHasCrossing = typeof favorite.crossingPointIndex === 'number';
  const targetHasCrossing = typeof crossingPointIndex === 'number';

  if (favoriteHasCrossing !== targetHasCrossing) {
    return false;
  }

  if (!favoriteHasCrossing) {
    return true;
  }

  return favorite.crossingPointIndex === crossingPointIndex;
};
