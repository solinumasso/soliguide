import { posthogService } from '$lib/services/posthogService';
import { writable, get } from 'svelte/store';
import type { GetSearchResultPageController, PageParams, PageState } from './types';
import type { PlacesService, PosthogCaptureFunction } from '$lib/services/types';
import { getErrorValue } from '$lib/ts';
import { buildSearchResultApiFilters, type SearchResultFilter } from './filters';

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
  urlParams: null,
  selectedFilters: []
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
    const selectedFilters: SearchResultFilter[] = [
      ...(urlParams.openToday === 'true' ? (['openToday'] as const) : []),
      ...(urlParams.airConditioned === 'true' ? (['airConditioned'] as const) : []),
      ...(urlParams.pmr === 'true' ? (['pmr'] as const) : []),
      ...(urlParams.animal === 'true' ? (['animal'] as const) : [])
    ];

    if (location && category && lang && latitude && longitude && type && label) {
      myPageStore.set({
        ...initialState,
        initializing: true,
        search: {
          location,
          category,
          lang,
          latitude: Number(latitude),
          longitude: Number(longitude),
          type,
          ...buildSearchResultApiFilters(selectedFilters),
          options: { page: 0 }
        },
        adressLabel: label,
        urlParams,
        selectedFilters
      });

      // Get data - put in store
      await getNextResults(true);
    }
  };

  const updateSearchFilters = async (selectedFilters: SearchResultFilter[]): Promise<void> => {
    myPageStore.update((oldValue): PageState => {
      const apiFilters = buildSearchResultApiFilters(selectedFilters);

      const urlParams: PageParams | null = oldValue.urlParams
        ? {
            lang: oldValue.urlParams.lang,
            location: oldValue.urlParams.location,
            latitude: oldValue.urlParams.latitude,
            longitude: oldValue.urlParams.longitude,
            type: oldValue.urlParams.type,
            label: oldValue.urlParams.label,
            category: oldValue.urlParams.category,
            ...(selectedFilters.includes('openToday') ? { openToday: 'true' } : {}),
            ...(selectedFilters.includes('airConditioned') ? { airConditioned: 'true' } : {}),
            ...(selectedFilters.includes('pmr') ? { pmr: 'true' } : {}),
            ...(selectedFilters.includes('animal') ? { animal: 'true' } : {})
          }
        : null;

      return {
        ...oldValue,
        searchResult: { nbResults: 0, places: [] },
        hasMorePages: false,
        searchError: null,
        selectedFilters,
        urlParams,
        search: {
          lang: oldValue.search.lang,
          location: oldValue.search.location,
          category: oldValue.search.category,
          latitude: oldValue.search.latitude,
          longitude: oldValue.search.longitude,
          type: oldValue.search.type,
          ...apiFilters,
          options: { page: 0 }
        }
      };
    });

    await getNextResults(true);
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
    updateSearchFilters,
    captureEvent
  };
};
