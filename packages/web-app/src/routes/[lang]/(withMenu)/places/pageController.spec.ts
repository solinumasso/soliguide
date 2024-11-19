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
import { getSearchResultPageController } from './pageController';
import { get } from 'svelte/store';
import { describe, expect, beforeEach, it, vi, vitest } from 'vitest';
import {
  fakePlacesService,
  searchParamsMock,
  searchResultMock
} from '$lib/services/placesService.mock';
import { fakeFetch } from '$lib/client/index';
import getSearchService from '$lib/services/placesService';
import { posthogService } from '$lib/services/posthogService';
import type { GetSearchResultPageController } from './types';

vi.mock('posthog-js');

describe('ListPageController', () => {
  // skipcq: JS-0119
  let pageState: GetSearchResultPageController;

  beforeEach(() => {
    pageState = getSearchResultPageController(fakePlacesService());
    pageState.init(searchParamsMock);
  });

  it('At initialization, i should have 4 search results', () => {
    expect(get(pageState).searchResult.places.length).toBe(4);
  });

  it('At initialization, i should have an adress label', () => {
    expect(get(pageState).adressLabel).toEqual('19 Rue Santeuil, 75005 Paris');
  });

  it('At initialization, we must be in page 1', () => {
    expect(get(pageState).search.options.page).toBe(1);
  });

  it('When i ask a need page, new results are added to the searchResults', async () => {
    await pageState.getNextResults();
    expect(get(pageState).searchResult.places.length).toEqual(8);
  });

  it('When i ask a need page, i should be on page 2', async () => {
    await pageState.getNextResults();
    expect(get(pageState).search.options.page).toBe(2);
  });

  it('When i ask a need page, i should be on page 2', async () => {
    vi.useFakeTimers();
    pageState.getNextResults();
    expect(get(pageState).isLoading).toBeTruthy();
    await vi.advanceTimersToNextTimerAsync();
    expect(get(pageState).isLoading).toBeFalsy();
  });

  it('If i have an error from searchPlaces, i should have an error message', async () => {
    pageState = getSearchResultPageController(fakePlacesService('There is an error'));
    pageState.init(searchParamsMock);
    expect(get(pageState).searchError).toBeNull();
    await pageState.getNextResults();
    expect(get(pageState).searchError).toEqual('There is an error');
  });

  describe('When the service does not always succeed', () => {
    const { fetch, feedWith, setError } = fakeFetch();
    const placesService = getSearchService(fetch);

    beforeEach(() => {
      pageState = getSearchResultPageController(placesService);
    });

    it('If i have an error from searchPlaces, i still have my previous search results', async () => {
      feedWith(searchResultMock);
      await pageState.init(searchParamsMock);
      expect(get(pageState).searchResult.places.length).toBe(4);
      setError('There is an error');
      await pageState.getNextResults();
      expect(get(pageState).searchResult.places.length).toBe(4);
    });
  });

  describe('Posthog capture events', () => {
    it('should call the posthogService with good prefix when capturing event', () => {
      vitest.spyOn(posthogService, 'capture');

      pageState.captureEvent('test', {});

      expect(posthogService.capture).toHaveBeenCalledWith('search-test', {});
    });
  });
});
