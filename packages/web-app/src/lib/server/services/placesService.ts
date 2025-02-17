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
import { env } from '$env/dynamic/private';
import { Categories, PlaceType, type ApiPlace, type ApiSearchResults } from '@soliguide/common';
import { fetch } from '$lib/client';
import { buildSearchResult } from '$lib/models/searchResult';
import { buildPlaceDetails } from '$lib/models/placeDetails';
import type { RequestOptions, SearchParams } from './types';
import type { PlaceDetails, SearchResult } from '$lib/models/types';
import type { PlaceDetailsParams } from '$lib/services/types';

const apiUrl = env.API_URL;

export default (fetcher = fetch) => {
  /**
   * Executes a search
   */
  const search = async (
    { lang, location, category, coordinates, type, distance, options = { page: 1 } }: SearchParams,
    commonHeaders: RequestOptions
  ): Promise<SearchResult> => {
    const url = `${apiUrl}new-search/${lang}`;

    const headers = {
      'Content-Type': 'application/json',
      ...commonHeaders
    };

    const body = {
      category,
      location: { geoValue: location, geoType: type, coordinates, distance }
    };

    const placesResult: ApiSearchResults = await fetcher(url, {
      method: 'POST',
      body: JSON.stringify({
        ...body,
        placeType: PlaceType.PLACE,
        options: { ...options, limit: 10, sortBy: 'distance' }
      }),
      headers
    });

    return buildSearchResult(
      placesResult,
      {
        geoType: type,
        coordinates,
        distance
      },
      category as Categories
    );
  };

  /**
   * Get place details
   */
  const placeDetails = async (
    { identifier, lang }: PlaceDetailsParams,
    commonHeaders: RequestOptions,
    categorySearched: Categories
  ): Promise<PlaceDetails> => {
    const url = `${apiUrl}place/${identifier}/${lang}`;

    const headers = {
      'Content-Type': 'application/json',
      ...commonHeaders
    };

    const placeResult: ApiPlace = await fetcher(url, {
      method: 'GET',
      headers
    });

    return buildPlaceDetails(placeResult, categorySearched);
  };

  return {
    placeDetails,
    search
  };
};
