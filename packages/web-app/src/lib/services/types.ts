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
import type { LocationSuggestion } from '$lib/models/locationSuggestion';
import type { SearchResult, PlaceDetails } from '$lib/models/types';
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
  getCategorySuggestions(searchTerm: string): Promise<Categories[]>;
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
  placeDetails(params: PlaceDetailsParams): Promise<PlaceDetails>;
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
  categorySelected?: Categories;
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
}

export interface ZendeskState {
  hasNewMessage: boolean;
}

export type PosthogCaptureFunction = (param: string, properties?: PosthogProperties) => void;
