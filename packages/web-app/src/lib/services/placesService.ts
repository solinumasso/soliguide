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
import { fetch } from '$lib/client';
import { Categories, GeoTypes, SupportedLanguagesCode } from '@soliguide/common';
import { posthogService } from '$lib/services/posthogService';
import type { PlaceDetailsParams, SearchOptions, SearchParams } from './types';
import type { PlaceDetails, SearchResult } from '$lib/models/types';
import { isValidStringEnumValue } from '$lib/ts';

export default (fetcher = fetch) => {
  const searchPlaces = (
    { lang, location, category, latitude, longitude, type }: SearchParams,
    options: SearchOptions = { page: 1 }
  ): Promise<SearchResult> => {
    if (!isValidStringEnumValue(SupportedLanguagesCode, lang)) {
      throw Error(`Bad request, lang ${lang} is invalid`);
    }
    if (!isValidStringEnumValue(Categories, category)) {
      throw Error(`Bad request, category ${category} is invalid`);
    }
    if (!isValidStringEnumValue(GeoTypes, type)) {
      throw Error(`Bad request, geoType ${type} is invalid`);
    }
    if (location.length === 0) {
      throw Error('Bad request, location cannot be empty');
    }

    // No need to map data as the backend service already does it
    return fetcher(`/api/${lang}/places`, {
      method: 'POST',
      body: JSON.stringify({
        lang,
        location,
        category,
        type,
        coordinates: [latitude, longitude],
        options
      }),
      headers: posthogService.getHeaders() as unknown as Record<string, string>
    });
  };

  const placeDetails = (
    { lang, identifier }: PlaceDetailsParams,
    categorySearched: Categories,
    crossingPointIndex?: number
  ): Promise<PlaceDetails> => {
    if (!isValidStringEnumValue(SupportedLanguagesCode, lang)) {
      throw Error(`Bad request, lang ${lang} is invalid`);
    }
    if (typeof identifier !== 'number' && !identifier) {
      throw Error(`Bad request, identifier ${identifier} cannot be empty`);
    }

    // No need to map data as the backend service already does it
    return fetcher(`/api/${lang}/places/${identifier}`, {
      method: 'POST',
      body: JSON.stringify({ categorySearched, crossingPointIndex }),
      headers: posthogService.getHeaders() as unknown as Record<string, string>
    });
  };

  const lookupPlaces = (
    { lang, ids }: { 
      lang: SupportedLanguagesCode; 
      ids: number[];
    }
  ): Promise<SearchResult> => {
    if (!isValidStringEnumValue(SupportedLanguagesCode, lang)) {
      throw Error(`Bad request, lang ${lang} is invalid`);
    }
    if (!Array.isArray(ids) || ids.length === 0) {
      throw Error('Bad request, ids must be a non-empty array');
    }
    if (ids.some(id => typeof id !== 'number' || id <= 0)) {
      throw Error('Bad request, all ids must be positive numbers');
    }
    
    return fetcher(`/api/${lang}/places/lookup`, {
      method: 'POST',
      body: JSON.stringify({ ids }),
      headers: posthogService.getHeaders() as unknown as Record<string, string>
    });
  };

  return {
    searchPlaces,
    placeDetails,
    lookupPlaces
  };
};
