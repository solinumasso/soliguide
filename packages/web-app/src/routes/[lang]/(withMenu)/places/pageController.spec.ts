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
import type { PlaceDetails } from '$lib/models/types';

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

  it('At initialization, selected filters are added to the search params', async () => {
    const searchPlaces = vi.fn().mockResolvedValue(searchResultMock);
    pageState = getSearchResultPageController({
      searchPlaces,
      placeDetails: vi.fn<() => Promise<PlaceDetails>>()
    });

    await pageState.init({
      ...searchParamsMock,
      openToday: 'true',
      airConditioned: 'true',
      pmr: 'true',
      animal: 'true'
    });

    expect(get(pageState).selectedFilters).toEqual([
      'openToday',
      'airConditioned',
      'pmr',
      'animal'
    ]);
    expect(searchPlaces).toHaveBeenCalledWith(
      expect.objectContaining({
        openToday: true,
        modalities: {
          pmr: true,
          animal: true,
          thermalComfort: { airConditioned: true }
        }
      }),
      { page: 1 }
    );
  });

  it('When filters are updated, it restarts search on the first page with new filters', async () => {
    const searchPlaces = vi.fn().mockResolvedValue(searchResultMock);
    pageState = getSearchResultPageController({
      searchPlaces,
      placeDetails: vi.fn<() => Promise<PlaceDetails>>()
    });

    await pageState.init(searchParamsMock);
    searchPlaces.mockClear();

    await pageState.updateSearchFilters(['pmr']);

    expect(get(pageState).selectedFilters).toEqual(['pmr']);
    expect(get(pageState).urlParams?.pmr).toBe('true');
    expect(get(pageState).urlParams).not.toHaveProperty('openToday');
    expect(get(pageState).urlParams).not.toHaveProperty('animal');
    expect(get(pageState).urlParams).not.toHaveProperty('airConditioned');
    expect(get(pageState).search.options.page).toBe(1);
    expect(searchPlaces).toHaveBeenCalledWith(
      expect.objectContaining({
        modalities: { pmr: true }
      }),
      { page: 1 }
    );
    expect(searchPlaces.mock.calls[0]?.[0]).not.toHaveProperty('openToday');
  });

  it('When filters are cleared, it restarts search without filters', async () => {
    const searchPlaces = vi.fn().mockResolvedValue(searchResultMock);
    pageState = getSearchResultPageController({
      searchPlaces,
      placeDetails: vi.fn<() => Promise<PlaceDetails>>()
    });

    await pageState.init({ ...searchParamsMock, openToday: 'true', pmr: 'true' });
    searchPlaces.mockClear();

    await pageState.updateSearchFilters([]);

    expect(get(pageState).selectedFilters).toEqual([]);
    expect(get(pageState).urlParams).not.toHaveProperty('openToday');
    expect(get(pageState).urlParams).not.toHaveProperty('pmr');
    expect(get(pageState).urlParams).not.toHaveProperty('animal');
    expect(get(pageState).urlParams).not.toHaveProperty('airConditioned');
    expect(searchPlaces.mock.calls[0]?.[0]).not.toHaveProperty('openToday');
    expect(searchPlaces.mock.calls[0]?.[0]).not.toHaveProperty('modalities');
    expect(searchPlaces.mock.calls[0]?.[1]).toEqual({ page: 1 });
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
