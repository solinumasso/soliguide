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
import { get, writable } from 'svelte/store';
import { debounce, DEFAULT_DEBOUNCE_DELAY } from '@soliguide/design-system';
import {
  Categories,
  CountryCodes,
  SupportedLanguagesCode,
  type SoliguideCountries
} from '@soliguide/common';
import {
  Focus,
  Steps,
  type PageOptions,
  type PageState,
  type SearchPageController,
  type SearchPageParams
} from './types';
import {
  CategoriesErrors,
  type CategoryService,
  LocationErrors,
  type LocationService,
  type PosthogCaptureFunction
} from '$lib/services/types';
import type { LocationSuggestion } from '$lib/models/locationSuggestion';
import { posthogService } from '$lib/services/posthogService';
import { getErrorValue } from '$lib/ts';
import { ALL_CATEGORIES, type CategorySearch } from '$lib/constants';

const SEARCH_LOCATION_MINIMUM_CHARS = 3;

const initialState: PageState = {
  country: CountryCodes.FR,
  lang: SupportedLanguagesCode.FR,
  currentStep: Steps.STEP_LOCATION,
  locationSuggestions: [],
  selectedLocationSuggestion: null,
  locationLabel: '',
  locationSuggestionError: LocationErrors.NONE,
  currentPositionError: null,
  categorySuggestions: [],
  selectedCategory: null,
  categorySuggestionError: CategoriesErrors.NONE,
  searchParams: null,
  focus: Focus.FOCUS_LOCATION,
  // Full page loading at init
  loading: false,
  loadingLocationSuggestions: false,
  loadingCategorySuggestions: false,
  loadingGeolocation: false
};

/**
 * Capture an event with a prefix for route context
 */
const captureEvent: PosthogCaptureFunction = (eventName, properties) => {
  posthogService.capture(`search-page-${eventName}`, properties);
};

export const getSearchPageController = (
  locationService: LocationService,
  categoryService: CategoryService
): SearchPageController => {
  const myPageStore = writable(initialState);

  const searchLocationSuggestions = async (search: string) => {
    try {
      const result = await locationService.getLocationSuggestions(get(myPageStore).country, search);
      myPageStore.update(
        (oldValue): PageState => ({
          ...oldValue,
          locationSuggestions: result,
          locationSuggestionError:
            result.length === 0 ? LocationErrors.NO_RESULTS : LocationErrors.NONE
        })
      );
    } catch {
      myPageStore.update(
        (oldValue): PageState => ({
          ...oldValue,
          locationSuggestionError: LocationErrors.ERROR_SERVER,
          locationSuggestions: []
        })
      );
    } finally {
      myPageStore.update(
        (oldValue): PageState => ({
          ...oldValue,
          loadingLocationSuggestions: false
        })
      );
    }
  };

  /** Location-api is called with a 300ms debounce */
  const getDebouncedLocationSuggestions = debounce(
    searchLocationSuggestions,
    DEFAULT_DEBOUNCE_DELAY
  );

  /**
   * Ask for suggestions corresponding to the search term
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getLocationSuggestions = (event: any) => {
    const searchTerm = event.value;

    myPageStore.update(
      (oldValue): PageState => ({
        ...oldValue,
        loadingLocationSuggestions: true,
        locationSuggestionError: LocationErrors.NONE,
        currentPositionError: null,
        locationLabel: searchTerm,
        locationSuggestions:
          searchTerm.length < SEARCH_LOCATION_MINIMUM_CHARS ? [] : oldValue.locationSuggestions
      })
    );

    // Do nothing unless the search term has at least 3 characters
    if (searchTerm.length >= SEARCH_LOCATION_MINIMUM_CHARS) {
      getDebouncedLocationSuggestions(searchTerm);
    } else {
      myPageStore.update(
        (oldValue): PageState => ({
          ...oldValue,
          loadingLocationSuggestions: false
        })
      );
    }
  };

  /**
   * Determine position then find the corresponding location
   */
  const useCurrentLocation = async (
    getGeolocation: () => Promise<GeolocationPosition>
  ): Promise<void> => {
    try {
      myPageStore.update(
        (oldValue): PageState => ({
          ...oldValue,
          currentPositionError: null,
          locationSuggestionError: LocationErrors.NONE,
          loadingGeolocation: true
        })
      );

      const {
        coords: { latitude, longitude }
      } = await getGeolocation();

      const result = await locationService.getLocationFromPosition(
        get(myPageStore).country,
        latitude,
        longitude
      );

      // We update the suggestions based on the geolocation
      searchLocationSuggestions(result?.suggestionLabel ?? '');

      myPageStore.update(
        (oldValue): PageState => ({
          ...oldValue,
          selectedLocationSuggestion: result,
          locationLabel: result?.suggestionLabel ?? '',
          currentStep: result ? Steps.STEP_CATEGORY : Steps.STEP_LOCATION,
          // Previous category errors are removed if we go to the page
          categorySuggestionError: result ? CategoriesErrors.NONE : oldValue.categorySuggestionError
        })
      );
      captureEvent('my-position', { position: { latitude, longitude } });
    } catch (error: unknown) {
      const errorValue = getErrorValue(error);
      const msg = typeof errorValue === 'string' ? errorValue : (errorValue?.message ?? null);

      myPageStore.update(
        (oldValue): PageState => ({
          ...oldValue,
          currentPositionError: msg,
          selectedLocationSuggestion: null
        })
      );
    } finally {
      myPageStore.update(
        (oldValue): PageState => ({
          ...oldValue,
          loadingGeolocation: false
        })
      );
    }
  };

  /**
   * We build search params only when all the data needed is valid
   */
  const buildSearchParams = (
    locationSelection: LocationSuggestion | null = null,
    categorySelection: CategorySearch | null = null
  ): SearchPageParams | null => {
    if (locationSelection !== null && categorySelection !== null) {
      const [latitude, longitude] = locationSelection.coordinates;
      return {
        lang: get(myPageStore).lang,
        location: locationSelection.geoValue,
        // Need to convert to string to be usable into URLSearchParams
        latitude: String(latitude),
        longitude: String(longitude),
        type: locationSelection.geoType,
        label: locationSelection.suggestionLabel,
        category: categorySelection
      };
    }
    return null;
  };

  const selectLocationSuggestion = (locationSuggestion: LocationSuggestion | null): void => {
    myPageStore.update(
      (oldValue): PageState => ({
        ...oldValue,
        selectedLocationSuggestion: locationSuggestion,
        locationLabel: locationSuggestion?.suggestionLabel ?? '',
        currentStep: oldValue.selectedCategory === null ? Steps.STEP_CATEGORY : Steps.STEP_LOCATION,
        searchParams: buildSearchParams(locationSuggestion, oldValue.selectedCategory),
        locationSuggestionError: LocationErrors.NONE,
        currentPositionError: null,
        categorySuggestionError: CategoriesErrors.NONE,
        focus: Focus.FOCUS_CATEGORY
      })
    );

    // Get new results based on the label of the selected suggestion
    searchLocationSuggestions(locationSuggestion?.suggestionLabel ?? '');
  };

  /**
   * Location input is cleared: erase suggestions and selected value
   */
  const clearLocation = (): void => {
    myPageStore.update(
      (oldValue): PageState => ({
        ...oldValue,
        selectedLocationSuggestion: null,
        locationSuggestions: [],
        locationLabel: '',
        currentStep: Steps.STEP_LOCATION,
        searchParams: buildSearchParams(),
        currentPositionError: null,
        locationSuggestionError: LocationErrors.NONE
      })
    );
  };

  /**
   * Go to previous step. It is always searchLocationStep
   */
  const goToPreviousStep = (): void => {
    myPageStore.update(
      (oldValue): PageState => ({
        ...oldValue,
        currentStep: Steps.STEP_LOCATION,
        focus: Focus.FOCUS_LOCATION
      })
    );
  };

  const getPreviousStep = () =>
    get(myPageStore).currentStep === Steps.STEP_CATEGORY ? Steps.STEP_LOCATION : Steps.HOME;

  const editLocation = () => {
    captureEvent('modify-location');
    if (get(myPageStore).currentStep === Steps.STEP_CATEGORY) {
      goToPreviousStep();
    }
  };

  /**
   * Get information about location based on the locationLabel param
   * Then we retrieve the previously selected item via its geoValue
   */
  const getLocationInfoFromParam = async (
    locationLabel: string,
    geoValue: string
  ): Promise<{
    suggestions: LocationSuggestion[];
    selection: LocationSuggestion | null;
    error: LocationErrors;
  }> => {
    try {
      const suggestions = await locationService.getLocationSuggestions(
        get(myPageStore).country,
        locationLabel
      );
      const selection = suggestions.find((suggestion) => suggestion.geoValue === geoValue) ?? null;
      return { suggestions, selection, error: LocationErrors.NONE };
    } catch (error: unknown) {
      return { suggestions: [], selection: null, error: error as LocationErrors };
    }
  };

  /**
   * Get information about categories based on the param (supposed to be a Categories object)
   */
  const getCategoryInfoFromParam = async (
    category: string
  ): Promise<{
    suggestions: Categories[];
    selection: Categories | null;
    error: CategoriesErrors;
  }> => {
    try {
      const suggestions = await categoryService.getCategorySuggestions(category);
      const selection = suggestions.find((suggestion) => suggestion === category) ?? null;
      return { suggestions, selection, error: CategoriesErrors.NONE };
    } catch (error) {
      return { suggestions: [], selection: null, error: error as CategoriesErrors };
    }
  };

  /**
   * Init controller: if a location and a category are provided,
   * the controller is initialized on categories page with proper selections and suggestions set
   * - the location is searched and the result matching the geoValue is used
   * - the category is validated
   * Special case: if category is ALL_CATEGORIES, we ignore it and don't initialize the category
   * In case of failure, controller is init with default empty value
   */
  const init = async (
    country: SoliguideCountries,
    lang: SupportedLanguagesCode,
    { geoValue, label, category }: PageOptions = {}
  ) => {
    myPageStore.set({ ...initialState, country, lang });

    const shouldIgnoreCategory = category === ALL_CATEGORIES;
    const shouldInitCategory = category && category !== ALL_CATEGORIES;

    if (geoValue && label && shouldInitCategory) {
      myPageStore.set({ ...initialState, loading: true });
      const locationInfo = await getLocationInfoFromParam(label, geoValue);
      const categoryInfo = await getCategoryInfoFromParam(category);

      // Stay on step 1 if there is an error or an option needs to be selected
      const step =
        locationInfo.error !== LocationErrors.NONE || !locationInfo.selection
          ? Steps.STEP_LOCATION
          : Steps.STEP_CATEGORY;

      myPageStore.set({
        ...initialState,
        country,
        lang,
        currentStep: step,
        locationSuggestions: locationInfo.suggestions,
        selectedLocationSuggestion: locationInfo.selection,
        locationLabel: locationInfo.selection?.suggestionLabel ?? '',
        locationSuggestionError: locationInfo.error,
        categorySuggestions: categoryInfo.suggestions,
        selectedCategory: categoryInfo.selection,
        categorySuggestionError: categoryInfo.error,
        focus: Focus.FOCUS_NONE,
        loading: false
      });
    } else if (geoValue && label && shouldIgnoreCategory) {
      // Special case: we have location but category is ALL_CATEGORIES
      // Initialize only the location, leave category empty
      myPageStore.set({ ...initialState, loading: true });
      const locationInfo = await getLocationInfoFromParam(label, geoValue);

      const step =
        locationInfo.error !== LocationErrors.NONE || !locationInfo.selection
          ? Steps.STEP_LOCATION
          : Steps.STEP_CATEGORY;

      myPageStore.set({
        ...initialState,
        country,
        lang,
        currentStep: step,
        locationSuggestions: locationInfo.suggestions,
        selectedLocationSuggestion: locationInfo.selection,
        locationLabel: locationInfo.selection?.suggestionLabel ?? '',
        locationSuggestionError: locationInfo.error,
        selectedCategory: null,
        focus: Focus.FOCUS_CATEGORY,
        loading: false
      });
    }
  };

  const selectCategorySuggestion = (categorySuggestion: CategorySearch): void => {
    if (get(myPageStore).currentStep === Steps.STEP_CATEGORY) {
      myPageStore.update(
        (oldValue): PageState => ({
          ...oldValue,
          selectedCategory: categorySuggestion,
          searchParams: buildSearchParams(oldValue.selectedLocationSuggestion, categorySuggestion)
        })
      );
    }
  };

  /** api is called with a 300ms debounce */
  const getDebouncedCategorySuggestions = debounce(async (search: string) => {
    try {
      const result = await categoryService.getCategorySuggestions(search);
      myPageStore.update(
        (oldValue): PageState => ({
          ...oldValue,
          categorySuggestions: result,
          categorySuggestionError:
            result.length === 0 ? CategoriesErrors.NO_RESULTS : CategoriesErrors.NONE
        })
      );
    } catch {
      myPageStore.update(
        (oldValue): PageState => ({
          ...oldValue,
          categorySuggestionError: CategoriesErrors.ERROR_SERVER,
          categorySuggestions: []
        })
      );
    } finally {
      myPageStore.update(
        (oldValue): PageState => ({
          ...oldValue,
          loadingCategorySuggestions: false
        })
      );
    }
  }, DEFAULT_DEBOUNCE_DELAY);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getCategorySuggestions = (event: any) => {
    const searchTerm = event.value;

    // Cannot do that on location step
    if (get(myPageStore).currentStep === Steps.STEP_LOCATION) {
      return;
    }
    myPageStore.update(
      (oldValue): PageState => ({
        ...oldValue,
        categorySuggestionError: CategoriesErrors.NONE,
        loadingCategorySuggestions: true,
        categorySuggestions: searchTerm.length === 0 ? [] : oldValue.categorySuggestions
      })
    );

    // Do nothing unless the search term has at least 3 characters
    if (searchTerm.length > 0) {
      getDebouncedCategorySuggestions(searchTerm);
    } else {
      myPageStore.update(
        (oldValue): PageState => ({
          ...oldValue,
          loadingCategorySuggestions: false
        })
      );
    }
  };

  /**
   * Category input is cleared
   */
  const clearCategory = () => {
    myPageStore.update(
      (oldValue): PageState => ({
        ...oldValue,
        selectedCategory: null,
        categorySuggestions: [],
        searchParams: buildSearchParams(),
        categorySuggestionError: CategoriesErrors.NONE
      })
    );
  };

  return {
    captureEvent,
    clearCategory,
    clearLocation,
    editLocation,
    getCategorySuggestions,
    getLocationSuggestions,
    getPreviousStep,
    goToPreviousStep,
    init,
    selectCategorySuggestion,
    selectLocationSuggestion,
    subscribe: myPageStore.subscribe,
    useCurrentLocation
  };
};
