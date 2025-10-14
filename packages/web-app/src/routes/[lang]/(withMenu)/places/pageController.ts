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
import { posthogService } from '$lib/services/posthogService';
import { writable, get } from 'svelte/store';
import type { GetSearchResultPageController, PageParams, PageState } from './types';
import type { PlacesService, PosthogCaptureFunction } from '$lib/services/types';
import { getErrorValue } from '$lib/ts';

const initialState: PageState = {
  isLoading: false,
  initializing: false,
  searchResult: { nbResults: 0, places: [] },
  adressLabel: '',
  search: {
    location: '',
    category: '',
    lang: '',
    latitude: 0,
    longitude: 0,
    type: '',
    options: { page: 0 }
  },
  searchError: null,
  hasMorePages: false,
  urlParams: null
};

export const getSearchResultPageController = (
  searchService: PlacesService
): GetSearchResultPageController => {
  const myPageStore = writable(initialState);

  /**
   * Update seachResult by adding new fetched places
   */
  const getNextResults = async (isInitialisation = false): Promise<void> => {
    // Set loading to true and increment page
    myPageStore.update(
      (oldValue): PageState => ({
        ...oldValue,
        isLoading: true
      })
    );

    // Get the current search in the store
    const { search } = get(myPageStore);

    try {
      const newOptions = { ...search.options, page: search.options.page + 1 };
      const result = await searchService.searchPlaces(search, newOptions);

      // If no more places to fetch, we notify the store
      myPageStore.update(
        (oldValue): PageState => ({
          ...oldValue,
          hasMorePages: result.places.length > 0,
          search: { ...oldValue.search, options: newOptions },
          searchResult: {
            nbResults: isInitialisation ? result.nbResults : oldValue.searchResult.nbResults,
            places: [...oldValue.searchResult.places, ...result.places]
          }
        })
      );
    } catch (error: unknown) {
      console.log('Error while fetching places', error);

      const errorValue = getErrorValue(error);

      myPageStore.update(
        (oldValue): PageState => ({
          ...oldValue,
          searchError:
            typeof errorValue !== 'string' && errorValue?.message
              ? errorValue.message
              : 'SEARCH_ERROR'
        })
      );
    } finally {
      myPageStore.update(
        (oldValue): PageState => ({
          ...oldValue,
          isLoading: false,
          initializing: false
        })
      );
    }
  };

  /**
   * Init the page with the url params from search page and the search result
   */
  const init = async (urlParams: PageParams): Promise<void> => {
    const { location, category, lang, latitude, longitude, type, label } = urlParams;

    if (location && category && lang && latitude && longitude && type && label) {
      myPageStore.set({
        ...initialState,
        initializing: true,
        search: {
          ...urlParams,
          latitude: Number(latitude),
          longitude: Number(longitude),
          options: { page: 0 }
        },
        adressLabel: label,
        urlParams
      });

      // Get data - put in store
      await getNextResults(true);
    }
  };

  /**
   * Capture an event with a prefix for route context
   */
  const captureEvent: PosthogCaptureFunction = (eventName, properties) => {
    posthogService.capture(`search-${eventName}`, properties);
  };

  return {
    subscribe: myPageStore.subscribe,
    init,
    getNextResults,
    captureEvent
  };
};
