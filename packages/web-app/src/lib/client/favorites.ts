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
import { getStorageItem, setStorageItem } from './storage';

const STORAGE_KEY_FAVORITES = 'favorites';
export const FAVORITES_LIMIT = COMMON_FAVORITES_LIMIT;

export const getFavoriteIds = (): number[] => {
  try {
    const raw = getStorageItem(STORAGE_KEY_FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const setFavoriteIds = (favoriteIds: number[]) => {
  setStorageItem(STORAGE_KEY_FAVORITES, JSON.stringify(favoriteIds));
};

export const favoriteIds = writable<number[]>(getFavoriteIds());

export const addFavorite = (id: number) => {
  favoriteIds.update((ids) => {
    if (ids.includes(id)) return ids;
    if (ids.length >= FAVORITES_LIMIT) return ids;
    return [...ids, id];
  });
};

export const removeFavorite = (id: number) => {
  favoriteIds.update(ids => ids.filter(fId => fId !== id));
};

export type FavoriteToggleStatus = 'added' | 'removed' | 'limitReached';

export const toggleFavorite = (id: number): FavoriteToggleStatus => {
  const currentIds = get(favoriteIds);

  if (currentIds.includes(id)) {
    favoriteIds.set(currentIds.filter((favoriteId) => favoriteId !== id));
    return 'removed';
  }

  if (currentIds.length >= FAVORITES_LIMIT) {
    return 'limitReached';
  }

  const newIds = [...currentIds, id];
  favoriteIds.set(newIds);

  return 'added';
};

export { favoriteIds as favorites };

favoriteIds.subscribe((val) => {
  setFavoriteIds(val);
});
