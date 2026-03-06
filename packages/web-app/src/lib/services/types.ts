import type { CategorySearch } from '$lib/constants';
import type { LocationSuggestion } from '$lib/models/locationSuggestion';
import type { SearchResult, PlaceDetails, DataForLogs } from '$lib/models/types';
import {
  Categories,
  GeoTypes,
  type SoliguideCountries,
  type SupportedLanguagesCode,
  type FlatCategoriesTreeNode
} from '@soliguide/common';

export interface LocationService {
  getLocationSuggestions(
    country: SoliguideCountries,
    searchTerm: string
  ): Promise<LocationSuggestion[]>;
  getLocationFromPosition(
    country: SoliguideCountries,
    latitude: number,
    longitude: number
  ): Promise<LocationSuggestion | null>;
}

export interface CategoryService {
  getAllCategories(): FlatCategoriesTreeNode[];
  getRootCategories(): Categories[];
  getChildrenCategories(categoryId: Categories): Categories[];
  isCategoryRoot(categoryId: Categories): boolean;
  hasChildren(categoryId: Categories): boolean;
  getCategorySuggestions(searchTerm: string, country: string, lang: string): Promise<Categories[]>;
}

// Search service
export interface SearchOptions {
  page: number;
}

export interface SearchParams {
  lang: string;
  location: string;
  category: string;
  latitude: number;
  longitude: number;
  type: string;
  options: SearchOptions;
}

export interface PlaceDetailsParams {
  identifier: string;
  lang: SupportedLanguagesCode;
}

export interface PlacesService {
  searchPlaces(params: SearchParams, options: SearchOptions): Promise<SearchResult>;
  placeDetails(
    params: PlaceDetailsParams,
    categorySearched: Categories,
    crossingPointIndex?: number
  ): Promise<PlaceDetails>;
}

export interface RequestOptionsFrontend {
  'X-Ph-User-Session-Id': string;
  'X-Ph-User-Distinct-Id': string;
}

/**
 * Enum describing the location search errors
 */
export enum LocationErrors {
  NONE = 'none',
  NO_RESULTS = 'noResults',
  ERROR_SERVER = 'errorServer'
}

/**
 * Enum describing the categories search errors
 */
export enum CategoriesErrors {
  NONE = 'none',
  NO_RESULTS = 'noResults',
  ERROR_SERVER = 'errorServer'
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    zE?: any;
  }
}

interface PosthogProperties {
  categorySelected?: CategorySearch;
  location?: string;
  completeLocation?: {
    geoValue: string;
    latitude: number;
    longitude: number;
    type: GeoTypes;
    label: string;
  };
  newLanguage?: SupportedLanguagesCode | null;
  position?: { latitude: number; longitude: number };
  searchTerm?: string;
  category?: Categories;
  fromStep?: 'location' | 'category';
  placeAddress?: string;
  phoneNumber?: string | null;
  email?: string;
  website?: string;
  isClickable?: boolean;
  placeId?: number;
  fromPlace?: number;
  clickedItem?: string;
  isDisabled?: boolean;
  place?: DataForLogs;
  action?: string;
}

export interface ZendeskState {
  hasNewMessage: boolean;
}

export type PosthogCaptureFunction = (param: string, properties?: PosthogProperties) => void;
