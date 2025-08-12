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
import {
  type SupportedLanguagesCode,
  Categories,
  GeoTypes,
  type SoliguideCountries
} from '@soliguide/common';
import type { CategoriesErrors, LocationErrors, PosthogCaptureFunction } from '$lib/services/types';
import type { LocationSuggestion } from '$lib/models/locationSuggestion';
import type { Writable } from 'svelte/store';

/**
 * Enum describing the current step of the search form
 */
export enum Steps {
  STEP_LOCATION = 'searchLocationStep',
  STEP_CATEGORY = 'searchCategoryStep',
  HOME = 'home'
}

/**
 * Enum describing the controlled focus possibilities of the page
 */
export enum Focus {
  FOCUS_NONE = 'focusNone',
  FOCUS_LOCATION = 'focusLocationInput',
  FOCUS_CATEGORY = 'focusCategoryInput'
}

/**
 * used for query string in search results page
 * location is the location geoValue
 * category is the category id
 * */
export interface SearchPageParams {
  lang: string;
  location: string;
  latitude: string;
  longitude: string;
  type: GeoTypes;
  label: string;
  category: string;
  department?: string;
  region?: string;
  departmentCode?: string;
  regionCode?: string;
}

export interface PageOptions {
  geoValue?: string | null;
  label?: string | null;
  category?: string | null;
}

/** State, visible to subscribers through the controller */
export interface PageState {
  country: SoliguideCountries;
  lang: SupportedLanguagesCode;
  currentStep: Steps;
  locationSuggestions: LocationSuggestion[];
  locationLabel: string;
  selectedLocationSuggestion: LocationSuggestion | null;
  locationSuggestionError: LocationErrors;
  currentPositionError: string | null;
  categorySuggestions: Categories[];
  selectedCategory: Categories | null;
  categorySuggestionError: CategoriesErrors;
  searchParams: SearchPageParams | null;
  focus: Focus;
  loading: boolean;
  loadingLocationSuggestions: boolean;
  loadingCategorySuggestions: boolean;
  loadingGeolocation: boolean;
}

/** exposes the state in readonly and functions to act on it */
export interface SearchPageController {
  subscribe: Writable<PageState>['subscribe'];
  selectLocationSuggestion(locationSuggestion: LocationSuggestion | null): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getLocationSuggestions(event: any): void;
  useCurrentLocation(geolocation: () => Promise<GeolocationPosition>): Promise<void>;
  clearLocation(): void;
  clearCategory(): void;
  goToPreviousStep(): void;
  editLocation(): void;
  init(country: SoliguideCountries, lang: SupportedLanguagesCode, options: PageOptions): void;
  getPreviousStep(): Steps;
  selectCategorySuggestion(categorySuggestion: Categories): void;
  captureEvent: PosthogCaptureFunction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCategorySuggestions(event: any): void;
}
