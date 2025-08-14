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
import type { Writable } from 'svelte/store';
import type { SearchResult } from '$lib/models/types';
import type { PosthogCaptureFunction, SearchParams } from '$lib/services/types';

// Similar to SearchPageParams (search page), but all url params are strings
export interface PageParams {
  lang: string;
  location: string;
  latitude: string;
  longitude: string;
  type: string;
  label: string;
  category: string;
  department: string;
  region: string;
  departmentCode: string;
  regionCode: string;
  country: string;
}

export interface PageState {
  isLoading: boolean;
  initializing: boolean;
  adressLabel: string;
  search: SearchParams;
  searchResult: SearchResult;
  searchError: string | null;
  hasMorePages: boolean;
  urlParams: PageParams | null;
}

/** Exposes the state in readonly and functions to act on it */
export interface GetSearchResultPageController {
  subscribe: Writable<PageState>['subscribe'];
  init(urlParams: PageParams): void;
  getNextResults(): void;
  captureEvent: PosthogCaptureFunction;
}
