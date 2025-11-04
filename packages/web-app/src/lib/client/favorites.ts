/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import { FAVORITES_LIMIT as COMMON_FAVORITES_LIMIT } from '@soliguide/common';
import { get, writable } from 'svelte/store';
import { favoriteKey, type FavoriteItem } from '$lib/models/favorite';
import { getStorageItem, setStorageItem } from './storage';

const STORAGE_KEY_FAVORITES = 'favorites';
export const FAVORITES_LIMIT = COMMON_FAVORITES_LIMIT;

export type FavoriteToggleStatus = 'added' | 'removed' | 'limitReached';

const loadFavorites = (): FavoriteItem[] => {
  try {
    const raw = getStorageItem(STORAGE_KEY_FAVORITES);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed as FavoriteItem[];
  } catch {
    return [];
  }
};

const persistFavorites = (favorites: FavoriteItem[]): FavoriteItem[] => {
  const limited = favorites.slice(0, FAVORITES_LIMIT);
  setStorageItem(STORAGE_KEY_FAVORITES, JSON.stringify(limited));
  return limited;
};

const buildReference = (lieuId: number, crossingPointIndex?: number): FavoriteItem =>
  typeof crossingPointIndex === 'number' && crossingPointIndex >= 0
    ? { lieuId, crossingPointIndex }
    : { lieuId };

const computeToggle = (
  favorites: FavoriteItem[],
  reference: FavoriteItem
): [FavoriteToggleStatus, FavoriteItem[]] => {
  const key = favoriteKey(reference);

  if (favorites.some((entry) => favoriteKey(entry) === key)) {
    return ['removed', favorites.filter((entry) => favoriteKey(entry) !== key)];
  }

  if (favorites.length >= FAVORITES_LIMIT) {
    return ['limitReached', favorites];
  }

  return ['added', [...favorites, reference]];
};

const createFavoritesStore = () => {
  const store = writable<FavoriteItem[]>(persistFavorites(loadFavorites()));

  const add = (favorite: FavoriteItem): void => {
    store.update((current) => {
      const key = favoriteKey(favorite);
      if (
        current.some((entry) => favoriteKey(entry) === key) ||
        current.length >= FAVORITES_LIMIT
      ) {
        return current;
      }

      return persistFavorites([...current, favorite]);
    });
  };

  const remove = (favorite: FavoriteItem): void => {
    store.update((current) => {
      const key = favoriteKey(favorite);
      const filtered = current.filter((entry) => favoriteKey(entry) !== key);
      return filtered.length === current.length ? current : persistFavorites(filtered);
    });
  };

  const toggle = (lieuId: number, crossingPointIndex?: number): FavoriteToggleStatus => {
    const reference = buildReference(lieuId, crossingPointIndex);
    const [status, nextFavorites] = computeToggle(get(store), reference);

    if (status !== 'limitReached') {
      store.update(() => persistFavorites(nextFavorites));
    }

    return status;
  };

  return {
    subscribe: store.subscribe,
    add,
    remove,
    toggle
  };
};

const favoritesStore = createFavoritesStore();

export const addFavorite = (favorite: FavoriteItem): void => {
  favoritesStore.add(favorite);
};

export const removeFavorite = (favorite: FavoriteItem): void => {
  favoritesStore.remove(favorite);
};

export const toggleFavorite = (lieuId: number, crossingPointIndex?: number): FavoriteToggleStatus =>
  favoritesStore.toggle(lieuId, crossingPointIndex);

export const favorites = {
  subscribe: favoritesStore.subscribe
};
