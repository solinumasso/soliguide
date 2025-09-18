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
import { writable, get } from 'svelte/store';
import { SupportedLanguagesCode } from '@soliguide/common';
import placesService from '$lib/services/placesService';
import type { PageState, CachedFavoritesData } from './types';

const initialState: PageState = {
  loading: false,
  favoritePlaces: [],
  error: null,
  lang: SupportedLanguagesCode.FR
};

const arraysEqual = (arr1: number[], arr2: number[]): boolean => {
  return arr1.length === arr2.length && arr1.every((val, index) => val === arr2[index]);
};

export const getFavoritesPageController = () => {
  const myPageStore = writable(initialState);
  const cachedDataStore = writable<CachedFavoritesData | null>(null);

  const isCacheValid = (favoriteIds: number[], currentLang: SupportedLanguagesCode): boolean => {
    const cached = get(cachedDataStore);
    if (!cached) return false;
    if (currentLang !== cached.lang) return false;
    if (!arraysEqual(favoriteIds, cached.favoriteIds)) return false;
    
    const now = new Date();
    const cacheDate = new Date(cached.timestamp);
    return now.toDateString() === cacheDate.toDateString();
  };

  const useCachedData = (currentLang: SupportedLanguagesCode): void => {
    const cached = get(cachedDataStore);
    if (cached) {
      myPageStore.update(state => ({
        ...state,
        favoritePlaces: cached.places,
        loading: false,
        error: null,
        lang: currentLang
      }));
    }
  };

  const syncWithFavorites = (favoriteIds: number[]): void => {
    const currentState = get(myPageStore);
    const stillFavorites = currentState.favoritePlaces.filter(place => 
      favoriteIds.includes(place.id)
    );
    
    myPageStore.update(state => ({
      ...state,
      favoritePlaces: stillFavorites
    }));
  };

  const loadFavoritePlaces = async (favoriteIds: number[], lang?: SupportedLanguagesCode): Promise<void> => {
    if (favoriteIds.length === 0) {
      myPageStore.set({ ...initialState });
      cachedDataStore.set(null);
      return;
    }

    const currentLang = lang || SupportedLanguagesCode.FR;

    if (isCacheValid(favoriteIds, currentLang)) {
      useCachedData(currentLang);
      return;
    }

    myPageStore.update(state => ({
      ...state,
      loading: true,
      error: null
    }));

    try {
      const result = await placesService().lookupPlaces({
        lang: currentLang,
        ids: favoriteIds
      });

      cachedDataStore.set({
        favoriteIds: [...favoriteIds],
        places: result.places,
        lang: currentLang,
        timestamp: Date.now()
      });

      myPageStore.update(state => ({
        ...state,
        favoritePlaces: result.places,
        loading: false,
        lang: currentLang
      }));
    } catch {
      myPageStore.update(state => ({
        ...state,
        error: 'Error loading favorites',
        loading: false
      }));
    }
  };

  return {
    loadFavoritePlaces,
    syncWithFavorites,
    subscribe: myPageStore.subscribe
  };
};