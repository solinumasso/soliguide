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
import { env } from '$env/dynamic/public';
import { mapSuggestions, type LocationSuggestion } from '$lib/models/locationSuggestion';
import { fetch } from '$lib/client';
import type { Fetcher } from '$lib/client/types';
import { LocationErrors, type LocationService } from './types';
import type { LocationAutoCompleteAddress, SoliguideCountries } from '@soliguide/common';
import { captureException } from '@sentry/sveltekit';

const locationApiUrl = env.PUBLIC_LOCATION_API_URL;

const SEARCH_LOCATION_MINIMUM_CHARS = 3;

export default (fetcher: Fetcher<LocationAutoCompleteAddress[]> = fetch): LocationService => {
  const getLocationSuggestions = async (
    country: SoliguideCountries,
    searchTerm: string
  ): Promise<LocationSuggestion[]> => {
    try {
      if (searchTerm.length < SEARCH_LOCATION_MINIMUM_CHARS) {
        return [];
      }

      const baseUrl = `${locationApiUrl}/autocomplete/${country}`;
      const url = `${baseUrl}/all/${encodeURI(searchTerm.trim())}`;

      const result = await fetcher(url);

      return mapSuggestions(result);
    } catch {
      throw LocationErrors.ERROR_SERVER;
    }
  };

  /**
   * Retrieve a location suggestion
   */
  const getLocationFromPosition = async (
    country: SoliguideCountries,
    latitude: number,
    longitude: number
  ): Promise<LocationSuggestion | null> => {
    try {
      const baseUrl = `${locationApiUrl}/reverse/${country}`;
      const url = `${baseUrl}/${latitude}/${longitude}`;

      const result = await fetcher(url);
      const mapped = mapSuggestions(result);

      // Should have 1 result in the array
      return mapped.length > 0 ? mapped[0] : null;
    } catch (error) {
      console.log(
        'getLocationFromPosition error :',
        error instanceof Error ? error.message : error
      );
      captureException(error);
      throw new Error('UNABLE_TO_LOCATE_YOU');
    }
  };

  return {
    getLocationSuggestions,
    getLocationFromPosition
  };
};
