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
import { describe, it, expect, beforeEach, afterEach, vi, vitest } from 'vitest';
import { get } from 'svelte/store';
import { getSearchPageController } from './pageController';
import getLocationService from '$lib/services/locationService';
import { getCategoryService } from '$lib/services/categoryService';
import { fakeFetch } from '$lib/client/index';
import {
  GeoTypes,
  Categories,
  Themes,
  CountryCodes,
  SupportedLanguagesCode,
  LocationAutoCompleteAddress,
  type SearchSuggestion,
  AutoCompleteType
} from '@soliguide/common';
import { posthogService } from '$lib/services/posthogService';
import type { LocationSuggestion } from '$lib/models/locationSuggestion';
import { Steps, Focus, type SearchPageController } from './types';
import { CategoriesErrors, LocationErrors } from '$lib/services/types';

const sampleSuggestions: LocationAutoCompleteAddress[] = [
  {
    name: 'suggestion1',
    label: 'address1',
    geoValue: 'geo1',
    geoType: GeoTypes.POSITION,
    city: 'city1',
    postalCode: 'postalCode1',
    coordinates: [1.2345, 6.09876],
    slugs: {}
  },
  {
    name: 'suggestion2',
    label: 'address2',
    geoValue: 'geo2',
    geoType: GeoTypes.CITY,
    city: 'city2',
    postalCode: 'postalCode2',
    coordinates: [5.2345, 8.12345],
    slugs: {}
  }
];
const sampleSuggestionsServiceResult: LocationSuggestion[] = [
  {
    suggestionLine1: 'suggestion1',
    suggestionLine2: 'postalCode1 city1',
    suggestionLabel: 'suggestion1, postalCode1 city1',
    geoValue: 'geo1',
    geoType: GeoTypes.POSITION,
    coordinates: [1.2345, 6.09876]
  },
  {
    suggestionLine1: 'suggestion2 (postalCode2)',
    suggestionLine2: 'GEOTYPE_VILLE',
    suggestionLabel: 'suggestion2 (postalCode2)',
    geoValue: 'geo2',
    geoType: GeoTypes.CITY,
    coordinates: [5.2345, 8.12345]
  }
];
const sampleLocationSuggestion: LocationSuggestion = {
  suggestionLine1: 'suggestion1',
  suggestionLine2: 'postalCode1 city1',
  suggestionLabel: 'suggestion1, postalCode1 city1',
  geoValue: 'geo1',
  geoType: GeoTypes.POSITION,
  coordinates: [1.2345, 6.09876]
};

const otherSampleSuggestions: LocationAutoCompleteAddress[] = [
  {
    name: 'suggestion1',
    label: 'address1',
    geoValue: 'geo1',
    geoType: GeoTypes.POSITION,
    city: 'city1',
    postalCode: 'postalCode1',
    coordinates: [1.2345, 6.09876],
    slugs: {}
  },
  {
    name: 'suggestion11',
    label: 'address11',
    geoValue: 'geo11',
    geoType: GeoTypes.CITY,
    city: 'city11',
    postalCode: 'postalCode11',
    coordinates: [5.2345, 8.12345],
    slugs: {}
  }
];
const otherSampleSuggestionsServiceResult: LocationSuggestion[] = [
  {
    suggestionLine1: 'suggestion1',
    suggestionLine2: 'postalCode1 city1',
    suggestionLabel: 'suggestion1, postalCode1 city1',
    geoValue: 'geo1',
    geoType: GeoTypes.POSITION,
    coordinates: [1.2345, 6.09876]
  },
  {
    suggestionLine1: 'suggestion11 (postalCode11)',
    suggestionLine2: 'GEOTYPE_VILLE',
    suggestionLabel: 'suggestion11 (postalCode11)',
    geoValue: 'geo11',
    geoType: GeoTypes.CITY,
    coordinates: [5.2345, 8.12345]
  }
];

const categoryApiData: SearchSuggestion[] = [
  {
    sourceId: 'hygiene_products',
    lang: SupportedLanguagesCode.FR,
    label: "Produits d'hygiène",
    categoryId: Categories.HYGIENE_PRODUCTS,
    slug: 'produits-hygiene',
    country: CountryCodes.FR,
    synonyms: [],
    type: AutoCompleteType.CATEGORY,
    content: '',
    seoTitle: 'HYGIENE_PRODUCTS',
    seoDescription: '',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    sourceId: 'digital_tools_training',
    lang: SupportedLanguagesCode.FR,
    label: 'Formation numérique',
    categoryId: Categories.DIGITAL_TOOLS_TRAINING,
    slug: 'formation-numerique',
    country: CountryCodes.FR,
    synonyms: [],
    type: AutoCompleteType.CATEGORY,
    content: '',
    seoTitle: 'DIGITAL_TOOLS_TRAINING',
    seoDescription: '',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleCategorySuggestions: Categories[] = [
  Categories.HYGIENE_PRODUCTS,
  Categories.DIGITAL_TOOLS_TRAINING
];

const geolocFn = (): Promise<GeolocationPosition> =>
  Promise.resolve({
    timestamp: 1725217275466,
    coords: {
      accuracy: 35,
      latitude: 123.2,
      longitude: 456.5,
      altitude: 0,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
      toJSON: () => ''
    },
    toJSON: () => ''
  });
const geolocFnError = () => Promise.reject(new Error('UNAUTHORIZED_LOCATION'));

vitest.spyOn(posthogService, 'capture').mockImplementation(() => 'captured');

describe('Search page', () => {
  // skipcq: JS-0119
  let pageState: SearchPageController;
  const { fetch, feedWith, setError } = fakeFetch();
  const {
    fetch: categoryFetch,
    feedWith: feedWithCategoriesData,
    setError: setCategoryError
  } = fakeFetch();
  const locationService = getLocationService(fetch);
  const categoryService = getCategoryService(Themes.SOLIGUIDE_FR, categoryFetch);

  beforeEach(() => {
    pageState = getSearchPageController(locationService, categoryService);
    pageState.init(CountryCodes.FR, SupportedLanguagesCode.FR, {});
    feedWith([]);
    setError(null);
    feedWithCategoriesData([]);
    setCategoryError(null);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('At the beginning we are at first page (where do you search)', () => {
    expect(get(pageState).currentStep).toEqual(Steps.STEP_LOCATION);
  });

  describe('Search location suggestions', () => {
    it('When we input search string in location field, we get suggestions', async () => {
      vi.useFakeTimers();
      feedWith(sampleSuggestions);
      await pageState.getLocationSuggestions({ value: 'abc' });
      await vi.runAllTimersAsync();
      expect(get(pageState).locationSuggestions).toEqual(sampleSuggestionsServiceResult);
    });

    it('When we are searching location suggestions, there is a loading state', async () => {
      vi.useFakeTimers();
      feedWith(sampleSuggestions);
      pageState.getLocationSuggestions({ value: 'abc' });
      expect(get(pageState).loadingLocationSuggestions).toBeTruthy();
      await vi.advanceTimersToNextTimerAsync();
      expect(get(pageState).loadingLocationSuggestions).toBeFalsy();
    });

    it('When a suggestion is selected, it is memorized and we go to second page (what do you search)', () => {
      pageState.selectLocationSuggestion(sampleLocationSuggestion);
      expect(get(pageState).selectedLocationSuggestion).toEqual(sampleLocationSuggestion);
      expect(get(pageState).currentStep).toEqual(Steps.STEP_CATEGORY);
    });

    it('When a suggestion is selected, location errors are cleared', () => {
      pageState.selectLocationSuggestion(sampleLocationSuggestion);
      expect(get(pageState).currentPositionError).toBeNull();
      expect(get(pageState).locationSuggestionError).toBe(LocationErrors.NONE);
    });

    it('When a suggestion is selected, new location suggestions are computed based on the label of the selection', async () => {
      // 1. make a search
      vi.useFakeTimers();
      feedWith(sampleSuggestions);
      await pageState.getLocationSuggestions({ value: 'abc' });
      await vi.runAllTimersAsync();
      expect(get(pageState).locationSuggestions).toEqual(sampleSuggestionsServiceResult);

      // 2. Feed with results of related search
      feedWith(otherSampleSuggestions);
      await pageState.selectLocationSuggestion(sampleLocationSuggestion);
      await vi.runAllTimersAsync();
      expect(get(pageState).locationSuggestions).toEqual(otherSampleSuggestionsServiceResult);
    });

    it('When we clear the search location input, suggestions disappear', async () => {
      vi.useFakeTimers();
      feedWith(sampleSuggestions);
      await pageState.getLocationSuggestions({ value: 'abc' });
      await vi.runAllTimersAsync();
      expect(get(pageState).locationSuggestions).toEqual(sampleSuggestionsServiceResult);
      await pageState.getLocationSuggestions({ value: '' });
      await vi.runAllTimersAsync();
      expect(get(pageState).locationSuggestions).toEqual([]);
    });

    it('When locationServices returns an error, the suggestions are emptied', async () => {
      vi.useFakeTimers();
      feedWith(sampleSuggestions);
      await pageState.getLocationSuggestions({ value: 'abc' });
      await vi.runAllTimersAsync();
      expect(get(pageState).locationSuggestions).toEqual(sampleSuggestionsServiceResult);

      setError({ status: 500, statusText: 'Internal server error' });
      await pageState.getLocationSuggestions({ value: 'abc' });
      await vi.runAllTimersAsync();
      expect(get(pageState).locationSuggestions).toEqual([]);
    });

    it('when location input is cleared, suggestions and selection are cleared, we go to step 1', async () => {
      vi.useFakeTimers();
      feedWith(sampleSuggestions);
      await pageState.getLocationSuggestions({ value: 'abc' });
      await vi.runAllTimersAsync();
      pageState.selectLocationSuggestion(sampleLocationSuggestion);
      expect(get(pageState).locationSuggestions).toEqual(sampleSuggestionsServiceResult);
      expect(get(pageState).selectedLocationSuggestion).toEqual(sampleLocationSuggestion);
      expect(get(pageState).currentStep).toEqual(Steps.STEP_CATEGORY);

      // Now clear
      pageState.clearLocation();
      expect(get(pageState).locationSuggestions).toEqual([]);
      expect(get(pageState).selectedLocationSuggestion).toBeNull();
      expect(get(pageState).currentStep).toEqual(Steps.STEP_LOCATION);
    });

    it('When there is a geolocation error, it is cleared when we search for suggestions', async () => {
      setError({ status: 404, statusText: 'Location not found' });
      await pageState.useCurrentLocation(geolocFn);
      expect(get(pageState).currentPositionError).not.toBeNull();

      vi.useFakeTimers();
      setError(null);
      feedWith(sampleSuggestions);
      await pageState.getLocationSuggestions({ value: 'abc' });
      await vi.runAllTimersAsync();
      expect(get(pageState).currentPositionError).toBeNull();
    });

    it('When the input is cleared, location suggestion error is reset', async () => {
      vi.useFakeTimers();
      setError({ status: 500, statusText: 'Internal server error' });
      await pageState.getLocationSuggestions({ value: 'abc' });
      await vi.runAllTimersAsync();
      expect(get(pageState).locationSuggestionError).not.toBe(LocationErrors.NONE);

      // Now clear
      pageState.clearLocation();
      expect(get(pageState).locationSuggestionError).toBe(LocationErrors.NONE);
    });

    it('When the input is cleared, geolocation error is reset', async () => {
      vi.useFakeTimers();
      setError({ status: 500, statusText: 'Internal server error' });
      await pageState.getLocationSuggestions({ value: 'abc' });
      await vi.runAllTimersAsync();

      // Now use geoloc
      setError({ status: 404, statusText: 'Location not found' });
      await pageState.useCurrentLocation(geolocFn);
      expect(get(pageState).currentPositionError).not.toBeNull();

      // Now clear
      pageState.clearLocation();
      expect(get(pageState).currentPositionError).toBeNull();
    });

    it('When we select a location suggestion and a geoloc error is present, it is cleared', async () => {
      setError({ status: 404, statusText: 'Location not found' });
      await pageState.useCurrentLocation(geolocFn);
      expect(get(pageState).currentPositionError).not.toBeNull();

      pageState.selectLocationSuggestion(sampleLocationSuggestion);
      expect(get(pageState).currentPositionError).toBeNull();
      expect(get(pageState).locationSuggestionError).toBe(LocationErrors.NONE);
    });
  });

  describe('select location with geolocation', () => {
    it('When we click on the geoloc button, the current location is selected and we are on page 2 (categories)', async () => {
      feedWith([sampleSuggestions[0]]);
      await pageState.useCurrentLocation(geolocFn);
      expect(get(pageState).selectedLocationSuggestion).toEqual(sampleLocationSuggestion);
      expect(get(pageState).currentStep).toEqual(Steps.STEP_CATEGORY);
      expect(get(pageState).currentPositionError).toBeNull();
    });

    it('When we click on the geoloc button, there is a loading state until the operation finishes', async () => {
      vi.useFakeTimers();
      feedWith([sampleSuggestions[0]]);
      pageState.useCurrentLocation(geolocFn);
      expect(get(pageState).loadingGeolocation).toBeTruthy();
      await vi.advanceTimersToNextTimerAsync();
      expect(get(pageState).loadingGeolocation).toBeFalsy();
    });

    it('When there is an error while retrieving the location, there is no selection and we stay on page 1', async () => {
      feedWith([sampleSuggestions[0]]);
      setError({ status: 404, statusText: 'Location not found' });
      await pageState.useCurrentLocation(geolocFn);
      expect(get(pageState).selectedLocationSuggestion).toBeNull();
      expect(get(pageState).currentStep).toEqual(Steps.STEP_LOCATION);
      expect(get(pageState).currentPositionError).toEqual('UNABLE_TO_LOCATE_YOU');
    });

    it('When the current location is not found, there is no selection and we stay on page 1', async () => {
      feedWith([]);
      await pageState.useCurrentLocation(geolocFn);
      expect(get(pageState).selectedLocationSuggestion).toBeNull();
      expect(get(pageState).currentStep).toEqual(Steps.STEP_LOCATION);
      expect(get(pageState).currentPositionError).toBeNull();
    });

    it('When the current position cannot be determined, there is no selection and we stay on page 1', async () => {
      setError({ status: 404, statusText: 'Location not found' });
      await pageState.useCurrentLocation(geolocFnError);
      expect(get(pageState).selectedLocationSuggestion).toBeNull();
      expect(get(pageState).currentStep).toEqual(Steps.STEP_LOCATION);
      expect(get(pageState).currentPositionError).toEqual('UNAUTHORIZED_LOCATION');
    });

    it('When location suggestion have an error, it is cleared when we use geolocation option', async () => {
      vi.useFakeTimers();
      setError({ status: 500, statusText: 'Internal server error' });
      await pageState.getLocationSuggestions({ value: 'abc' });
      await vi.runAllTimersAsync();
      expect(get(pageState).locationSuggestionError).not.toBe(LocationErrors.NONE);

      await pageState.useCurrentLocation(geolocFn);
      expect(get(pageState).locationSuggestionError).toBe(LocationErrors.NONE);
    });
  });

  describe('select category with selector', () => {
    it('From step 1, when a category is selected, nothing happens', () => {
      const initialState = get(pageState);
      expect(get(pageState).currentStep).toEqual(Steps.STEP_LOCATION);
      expect(get(pageState).selectedCategory).toBeNull();

      pageState.selectCategorySuggestion(Categories.FOOD);
      expect(get(pageState)).toEqual(initialState);
    });

    it('From step 2, when a category is selected, it is memorized', () => {
      const categoryId = Categories.FOOD;
      pageState.selectLocationSuggestion(sampleLocationSuggestion);

      expect(get(pageState).currentStep).toEqual(Steps.STEP_CATEGORY);
      expect(get(pageState).selectedCategory).toBeNull();

      pageState.selectCategorySuggestion(categoryId);
      expect(get(pageState).selectedCategory).toEqual(categoryId);
    });
  });

  describe('search category suggestions', () => {
    beforeEach(async () => {
      vi.useFakeTimers();
      feedWith(sampleSuggestions);
      await pageState.getLocationSuggestions({ value: 'abc' });
      await vi.runAllTimersAsync();
      pageState.selectLocationSuggestion(sampleLocationSuggestion);
    });

    it('When I type characters, I get category suggestions', async () => {
      feedWithCategoriesData(categoryApiData);
      await pageState.getCategorySuggestions({ value: 'abc' });
      await vi.runAllTimersAsync();
      expect(get(pageState).categorySuggestions).toEqual(sampleCategorySuggestions);
    });

    it('When we search for categories, there is a loading state until the operation finishes', async () => {
      feedWithCategoriesData(categoryApiData);
      pageState.getCategorySuggestions({ value: 'abc' });
      expect(get(pageState).loadingCategorySuggestions).toBeTruthy();
      await vi.advanceTimersToNextTimerAsync();
      expect(get(pageState).loadingCategorySuggestions).toBeFalsy();
    });

    it('When I type no character, I get no category suggestions', async () => {
      feedWithCategoriesData(categoryApiData);
      await pageState.getCategorySuggestions({ value: '' });
      await vi.runAllTimersAsync();
      expect(get(pageState).categorySuggestions).toEqual([]);
    });

    it('When I select a category, it is memorized', async () => {
      feedWithCategoriesData(categoryApiData);
      await pageState.getCategorySuggestions({ value: 'abc' });
      await vi.runAllTimersAsync();
      expect(get(pageState).categorySuggestions).toEqual(sampleCategorySuggestions);
    });

    it('When a suggestion is selected, category errors are cleared', () => {
      const [selectedSuggestion] = sampleCategorySuggestions;
      pageState.selectCategorySuggestion(selectedSuggestion);
      expect(get(pageState).selectedCategory).toEqual(selectedSuggestion);
    });

    it('When the category is cleared, the suggestions disappear', async () => {
      feedWithCategoriesData(categoryApiData);
      await pageState.getCategorySuggestions({ value: 'abc' });
      await vi.runAllTimersAsync();
      expect(get(pageState).categorySuggestions).toEqual(sampleCategorySuggestions);
      pageState.clearCategory();
      expect(get(pageState).categorySuggestions).toEqual([]);
    });

    it('When the categoryService fails, I have an error and no suggestion', async () => {
      feedWithCategoriesData(categoryApiData);
      setCategoryError({ status: 500, statusText: 'Internal server error' });
      await pageState.getCategorySuggestions({ value: 'abc' });
      await vi.runAllTimersAsync();
      expect(get(pageState).categorySuggestions).toEqual([]);
      expect(get(pageState).categorySuggestionError).toEqual(CategoriesErrors.ERROR_SERVER);
    });
  });

  describe('Navigation', () => {
    it('When we go back from search location page, the new step is home (navigate to /)', () => {
      expect(get(pageState).currentStep).toEqual(Steps.STEP_LOCATION);
      expect(pageState.getPreviousStep()).toEqual(Steps.HOME);
    });

    it('When we go back from search category page, the new step is search category', () => {
      pageState.selectLocationSuggestion(sampleLocationSuggestion);
      expect(get(pageState).currentStep).toEqual(Steps.STEP_CATEGORY);
      expect(pageState.getPreviousStep()).toEqual(Steps.STEP_LOCATION);
      pageState.goToPreviousStep();
      expect(get(pageState).currentStep).toEqual(Steps.STEP_LOCATION);
    });

    it('On step 2, if a category is selected and a location is already selected, we can know the url to redirect to', () => {
      const categoryId = Categories.FOOD;
      pageState.selectLocationSuggestion(sampleLocationSuggestion);
      pageState.selectCategorySuggestion(categoryId);
      expect(get(pageState).selectedCategory).toEqual(categoryId);
      expect(get(pageState).selectedLocationSuggestion).toEqual(sampleLocationSuggestion);
      expect(get(pageState).searchParams).toBeDefined();
      expect(get(pageState).searchParams).toEqual({
        lang: SupportedLanguagesCode.FR,
        category: Categories.FOOD,
        label: 'suggestion1, postalCode1 city1',
        latitude: '1.2345',
        location: 'geo1',
        longitude: '6.09876',
        type: GeoTypes.POSITION
      });
    });

    it('On step 1, calling getCategorySuggestions has no effect', async () => {
      expect(get(pageState).currentStep).toEqual(Steps.STEP_LOCATION);
      vi.useFakeTimers();
      feedWithCategoriesData(categoryApiData);
      await pageState.getCategorySuggestions({ value: 'abc' });
      await vi.runAllTimersAsync();
      expect(get(pageState).categorySuggestions).toEqual([]);
    });

    it('On step 2, when we click on the location input, we are redirected to step 1', () => {
      pageState.selectLocationSuggestion(sampleLocationSuggestion);
      expect(get(pageState).currentStep).toEqual(Steps.STEP_CATEGORY);
      pageState.editLocation();
      expect(get(pageState).currentStep).toEqual(Steps.STEP_LOCATION);
    });

    it('On step 1, when we click on the location input, there is no redirection', () => {
      expect(get(pageState).currentStep).toEqual(Steps.STEP_LOCATION);
      pageState.editLocation();
      expect(get(pageState).currentStep).toEqual(Steps.STEP_LOCATION);
    });

    describe('When We arrive on the page with parameters location and category', () => {
      const pageParams = {
        geoValue: 'poul-pout-22610-pleubian',
        label: 'Poul Pout, 22610 Pleubian',
        category: Categories.HEALTH
      };

      const locationApiResult = [
        {
          name: 'Poul Pout',
          label: 'Poul Pout, 22610 Pleubian',
          geoValue: 'poul-pout-22610-pleubian',
          geoType: GeoTypes.POSITION,
          city: 'Pleubian',
          postalCode: '22610',
          coordinates: [1.2345, 6.789]
        },
        {
          name: 'Bourg-Madame',
          label: 'Bourg-Madame (66760)',
          geoValue: 'bourg-madame-66760',
          city: 'Bourg-Madame',
          postalCode: '66760',
          geoType: GeoTypes.CITY,
          coordinates: [6.5432, 3.74567]
        }
      ];
      const locationSuggestions = [
        {
          suggestionLine1: 'Poul Pout',
          suggestionLine2: '22610 Pleubian',
          geoValue: 'poul-pout-22610-pleubian',
          suggestionLabel: 'Poul Pout, 22610 Pleubian',
          geoType: GeoTypes.POSITION,
          coordinates: [1.2345, 6.789]
        },
        {
          suggestionLine1: 'Bourg-Madame (66760)',
          suggestionLine2: 'GEOTYPE_VILLE',
          suggestionLabel: 'Bourg-Madame (66760)',
          geoValue: 'bourg-madame-66760',
          geoType: GeoTypes.CITY,
          coordinates: [6.5432, 3.74567]
        }
      ];
      const selectedLocationSuggestion = {
        suggestionLine1: 'Poul Pout',
        suggestionLine2: '22610 Pleubian',
        geoValue: 'poul-pout-22610-pleubian',
        suggestionLabel: 'Poul Pout, 22610 Pleubian',
        geoType: GeoTypes.POSITION,
        coordinates: [1.2345, 6.789]
      };

      it('The page is loading while data is retrieved', async () => {
        vi.useFakeTimers();
        feedWith(locationApiResult);
        feedWithCategoriesData(categoryApiData);
        pageState.init(CountryCodes.FR, SupportedLanguagesCode.FR, pageParams);
        expect(get(pageState).loading).toBeTruthy();
        await vi.advanceTimersToNextTimerAsync();
        expect(get(pageState).loading).toBeFalsy();
      });

      it('The current step is STEP_CATEGORY', async () => {
        feedWith(locationApiResult);
        feedWithCategoriesData(categoryApiData);
        await pageState.init(CountryCodes.FR, SupportedLanguagesCode.FR, pageParams);
        expect(get(pageState).currentStep).toEqual(Steps.STEP_CATEGORY);
      });

      describe('On location side', () => {
        it('There are location suggestions resulting of a search of the location param', async () => {
          feedWith(locationApiResult);
          feedWithCategoriesData(categoryApiData);
          await pageState.init(CountryCodes.FR, SupportedLanguagesCode.FR, pageParams);
          expect(get(pageState).locationSuggestions).toEqual(locationSuggestions);
        });

        it('When one of the suggestions matches the location geoValue param, it is selected', async () => {
          feedWith(locationApiResult);
          feedWithCategoriesData(categoryApiData);
          await pageState.init(CountryCodes.FR, SupportedLanguagesCode.FR, pageParams);
          expect(get(pageState).selectedLocationSuggestion).toEqual(selectedLocationSuggestion);
        });

        it('When no suggestion matches the location geoValue param, there is no selection', async () => {
          feedWith(sampleSuggestions);
          feedWithCategoriesData(categoryApiData);
          await pageState.init(CountryCodes.FR, SupportedLanguagesCode.FR, pageParams);
          expect(get(pageState).selectedLocationSuggestion).toBeNull();
        });

        it('When no location suggestion can be selected, we are on page 1 (location)', async () => {
          feedWith(sampleSuggestions);
          feedWithCategoriesData(categoryApiData);
          await pageState.init(CountryCodes.FR, SupportedLanguagesCode.FR, pageParams);
          expect(get(pageState).selectedLocationSuggestion).toBeNull();
          expect(get(pageState).currentStep).toEqual(Steps.STEP_LOCATION);
        });
      });

      describe('On category side', () => {
        it('There are category suggestions resulting of a search of the category param', async () => {
          feedWith(locationApiResult);
          feedWithCategoriesData(categoryApiData);
          await pageState.init(CountryCodes.FR, SupportedLanguagesCode.FR, pageParams);
          expect(get(pageState).categorySuggestions).toEqual(sampleCategorySuggestions);
        });

        it('When one of the result matches the category param, it is selected', async () => {
          const categoryApiResult: SearchSuggestion[] = [
            {
              sourceId: 'health',
              lang: SupportedLanguagesCode.FR,
              label: 'Santé',
              categoryId: Categories.HEALTH,
              slug: 'sante',
              country: CountryCodes.FR,
              synonyms: [],
              type: AutoCompleteType.CATEGORY,
              content: '',
              seoTitle: 'HEALTH',
              seoDescription: '',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              sourceId: 'hygiene_products',
              lang: SupportedLanguagesCode.FR,
              label: "Produits d'hygiène",
              categoryId: Categories.HYGIENE_PRODUCTS,
              slug: 'produits-hygiene',
              country: CountryCodes.FR,
              synonyms: [],
              type: AutoCompleteType.CATEGORY,
              content: '',
              seoTitle: 'HYGIENE_PRODUCTS',
              seoDescription: '',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              sourceId: 'digital_tools_training',
              lang: SupportedLanguagesCode.FR,
              label: 'Formation numérique',
              categoryId: Categories.DIGITAL_TOOLS_TRAINING,
              slug: 'formation-numerique',
              country: CountryCodes.FR,
              synonyms: [],
              type: AutoCompleteType.CATEGORY,
              content: '',
              seoTitle: 'DIGITAL_TOOLS_TRAINING',
              seoDescription: '',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ];
          feedWith(locationApiResult);
          feedWithCategoriesData(categoryApiResult);
          await pageState.init(CountryCodes.FR, SupportedLanguagesCode.FR, pageParams);
          expect(get(pageState).selectedCategory).toEqual(Categories.HEALTH);
        });

        it('When none of the results matches the category param, no category is selected', async () => {
          const categoryApiResult: SearchSuggestion[] = [
            {
              sourceId: 'hygiene_products',
              lang: SupportedLanguagesCode.FR,
              label: "Produits d'hygiène",
              categoryId: Categories.HYGIENE_PRODUCTS,
              slug: 'produits-hygiene',
              country: CountryCodes.FR,
              synonyms: [],
              type: AutoCompleteType.CATEGORY,
              content: '',
              seoTitle: 'HYGIENE_PRODUCTS',
              seoDescription: '',
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              sourceId: 'digital_tools_training',
              lang: SupportedLanguagesCode.FR,
              label: 'Formation numérique',
              categoryId: Categories.DIGITAL_TOOLS_TRAINING,
              slug: 'formation-numerique',
              country: CountryCodes.FR,
              synonyms: [],
              type: AutoCompleteType.CATEGORY,
              content: '',
              seoTitle: 'DIGITAL_TOOLS_TRAINING',
              seoDescription: '',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          ];
          feedWith(locationApiResult);
          feedWithCategoriesData(categoryApiResult);
          await pageState.init(CountryCodes.FR, SupportedLanguagesCode.FR, pageParams);
          expect(get(pageState).selectedCategory).toBeNull();
        });

        it('When a specialist category is provided, we may have suggestions, but no selection', async () => {
          feedWith(locationApiResult);
          feedWithCategoriesData(categoryApiData);
          await pageState.init(CountryCodes.FR, SupportedLanguagesCode.FR, {
            geoValue: 'poul-pout-22610-pleubian',
            label: 'Poul Pout, 22610 Pleubian',
            category: Categories.DERMATOLOGY
          });
          expect(get(pageState).selectedCategory).toBeNull();
        });
      });

      describe('When the location service fails', () => {
        it('We stay on page 1', async () => {
          setError({ status: 500, statusText: 'Something went wrong' });
          feedWithCategoriesData(categoryApiData);
          await pageState.init(CountryCodes.FR, SupportedLanguagesCode.FR, pageParams);
          expect(get(pageState).currentStep).toEqual(Steps.STEP_LOCATION);
        });

        it('If the category service succeeds, we have category suggestions', async () => {
          setError({ status: 500, statusText: 'Something went wrong' });
          feedWithCategoriesData(categoryApiData);
          await pageState.init(CountryCodes.FR, SupportedLanguagesCode.FR, pageParams);
          expect(get(pageState).categorySuggestions).toEqual(sampleCategorySuggestions);
        });

        it('If the category service fails, we have no category suggestion', async () => {
          setError({ status: 500, statusText: 'Something went wrong' });
          setCategoryError({ status: 500, statusText: 'Something went wrong' });
          await pageState.init(CountryCodes.FR, SupportedLanguagesCode.FR, pageParams);
          expect(get(pageState).categorySuggestions).toEqual([]);
        });
      });

      describe('When the category service fails', () => {
        it('We are on page 2', async () => {
          feedWith(locationApiResult);
          setCategoryError({ status: 500, statusText: 'Something went wrong' });
          await pageState.init(CountryCodes.FR, SupportedLanguagesCode.FR, pageParams);
          expect(get(pageState).currentStep).toEqual(Steps.STEP_CATEGORY);
        });

        it('There is an error message', async () => {
          feedWith(locationApiResult);
          setCategoryError({ status: 500, statusText: 'Something went wrong' });
          await pageState.init(CountryCodes.FR, SupportedLanguagesCode.FR, pageParams);
          expect(get(pageState).categorySuggestionError).toEqual(CategoriesErrors.ERROR_SERVER);
        });

        it('There is no category suggested nor selected', async () => {
          feedWith(locationApiResult);
          setCategoryError({ status: 500, statusText: 'Something went wrong' });
          await pageState.init(CountryCodes.FR, SupportedLanguagesCode.FR, pageParams);
          expect(get(pageState).categorySuggestions).toEqual([]);
          expect(get(pageState).selectedCategory).toEqual(null);
        });
      });

      it('If both services fail, If we choose current position, we arrive on page 2 and category errors are removed', async () => {
        setError({ status: 500, statusText: 'Something went wrong' });
        setCategoryError({ status: 500, statusText: 'Something went wrong' });
        await pageState.init(CountryCodes.FR, SupportedLanguagesCode.FR, pageParams);

        setError(null);
        feedWith([sampleSuggestions[0]]);
        await pageState.useCurrentLocation(geolocFn);
        expect(get(pageState).selectedLocationSuggestion).toEqual(sampleLocationSuggestion);
        expect(get(pageState).currentStep).toEqual(Steps.STEP_CATEGORY);
        expect(get(pageState).categorySuggestionError).toEqual(CategoriesErrors.NONE);
      });

      it('If both services fail, If we try searching location again, succeed and select an option, we arrive on page 2 and category errors are removed', async () => {
        setError({ status: 500, statusText: 'Something went wrong' });
        setCategoryError({ status: 500, statusText: 'Something went wrong' });
        await pageState.init(CountryCodes.FR, SupportedLanguagesCode.FR, pageParams);

        setError(null);
        feedWith(sampleSuggestions);
        vi.useFakeTimers();
        await pageState.getLocationSuggestions({ value: 'abc' });
        await vi.runAllTimersAsync();
        expect(get(pageState).locationSuggestions).toEqual(sampleSuggestionsServiceResult);
        pageState.selectLocationSuggestion(sampleLocationSuggestion);
        expect(get(pageState).selectedLocationSuggestion).toEqual(sampleLocationSuggestion);
        expect(get(pageState).currentStep).toEqual(Steps.STEP_CATEGORY);
        expect(get(pageState).categorySuggestionError).toEqual(CategoriesErrors.NONE);
      });

      it('If we modify location selection, we go directly to results page instead of going to step 2 because we already have a category selected', async () => {
        const categoryApiResult: SearchSuggestion[] = [
          {
            sourceId: 'health',
            lang: SupportedLanguagesCode.FR,
            label: 'Santé',
            categoryId: Categories.HEALTH,
            slug: 'sante',
            country: CountryCodes.FR,
            synonyms: [],
            type: AutoCompleteType.CATEGORY,
            content: '',
            seoTitle: 'HEALTH',
            seoDescription: '',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            sourceId: 'hygiene_products',
            lang: SupportedLanguagesCode.FR,
            label: "Produits d'hygiène",
            categoryId: Categories.HYGIENE_PRODUCTS,
            slug: 'produits-hygiene',
            country: CountryCodes.FR,
            synonyms: [],
            type: AutoCompleteType.CATEGORY,
            content: '',
            seoTitle: 'HYGIENE_PRODUCTS',
            seoDescription: '',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            sourceId: 'digital_tools_training',
            lang: SupportedLanguagesCode.FR,
            label: 'Formation numérique',
            categoryId: Categories.DIGITAL_TOOLS_TRAINING,
            slug: 'formation-numerique',
            country: CountryCodes.FR,
            synonyms: [],
            type: AutoCompleteType.CATEGORY,
            content: '',
            seoTitle: 'DIGITAL_TOOLS_TRAINING',
            seoDescription: '',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];
        feedWith(locationApiResult);
        feedWithCategoriesData(categoryApiResult);
        await pageState.init(CountryCodes.FR, SupportedLanguagesCode.FR, pageParams);

        expect(get(pageState).selectedCategory).not.toBeNull();
        pageState.editLocation();
        expect(get(pageState).currentStep).toEqual(Steps.STEP_LOCATION);
        pageState.selectLocationSuggestion(sampleLocationSuggestion);
        expect(get(pageState).currentStep).toEqual(Steps.STEP_LOCATION);
      });
    });
  });

  describe('Focus management', () => {
    it('When we arrive on the page, focus is on the location input', () => {
      expect(get(pageState).focus).toEqual(Focus.FOCUS_LOCATION);
    });

    it('When we arrive on categories page after selecting a location suggestion, focus is on the category input', () => {
      pageState.selectLocationSuggestion(sampleLocationSuggestion);
      expect(get(pageState).currentStep).toEqual(Steps.STEP_CATEGORY);
      expect(get(pageState).focus).toEqual(Focus.FOCUS_CATEGORY);
    });

    it('When we navigate back from Categories page, focus is on the location input', () => {
      pageState.selectLocationSuggestion(sampleLocationSuggestion);
      pageState.goToPreviousStep();
      expect(get(pageState).currentStep).toEqual(Steps.STEP_LOCATION);
      expect(get(pageState).focus).toEqual(Focus.FOCUS_LOCATION);
    });

    it('When we arrive from results page for modification, we are on Categories page and there is no autofocus', async () => {
      feedWith([
        {
          name: 'Poul Pout',
          label: 'Poul Pout, 22610 Pleubian',
          geoValue: 'poul-pout-22610-pleubian',
          geoType: 'position',
          city: 'Pleubian'
        }
      ]);
      feedWithCategoriesData(categoryApiData);
      pageState.selectLocationSuggestion(sampleLocationSuggestion);
      pageState.selectCategorySuggestion(Categories.HEALTH);
      await pageState.init(CountryCodes.FR, SupportedLanguagesCode.FR, {
        geoValue: 'poul-pout-22610-pleubian',
        label: 'Poul Pout, 22610 Pleubian',
        category: Categories.HEALTH
      });
      expect(get(pageState).focus).toEqual(Focus.FOCUS_NONE);
    });
  });

  describe('Posthog capture events', () => {
    it('should call the posthogService with good prefix when capturing event', () => {
      pageState.captureEvent('test', {
        searchTerm: 'searchTerm',
        position: { latitude: 0, longitude: 1 },
        location: 'location'
      });

      expect(posthogService.capture).toHaveBeenCalledWith('search-page-test', {
        searchTerm: 'searchTerm',
        position: { latitude: 0, longitude: 1 },
        location: 'location'
      });
    });
  });
});
