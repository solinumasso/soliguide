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
