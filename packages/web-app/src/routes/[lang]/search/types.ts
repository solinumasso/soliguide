import {
  type SupportedLanguagesCode,
  Categories,
  GeoTypes,
  type SoliguideCountries
} from '@soliguide/common';
import type { CategoriesErrors, LocationErrors, PosthogCaptureFunction } from '$lib/services/types';
import type { LocationSuggestion } from '$lib/models/locationSuggestion';
import type { Writable } from 'svelte/store';
import type { CategorySearch } from '$lib/constants';

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
 * category is the category id (can be ALL_CATEGORIES for searching all)
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
  selectedCategory: CategorySearch | null;
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
  selectCategorySuggestion(categorySuggestion: CategorySearch): void;
  captureEvent: PosthogCaptureFunction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCategorySuggestions(event: any): void;
}
