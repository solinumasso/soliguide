import { env } from '$env/dynamic/private';
import { Categories, PlaceType, type ApiPlace, type ApiSearchResults } from '@soliguide/common';
import { fetch } from '$lib/client';
import { buildSearchResultWithParcours } from '$lib/models/searchResult';
import { buildLookupResult } from '$lib/models/lookupResult';
import { buildPlaceDetails } from '$lib/models/placeDetails';
import type { RequestOptions, SearchParams } from './types';
import type { PlaceDetails, SearchFavorisResult, SearchResult } from '$lib/models/types';
import type { PlaceDetailsParams } from '$lib/services/types';
import type { FavoriteItem } from '$lib/models/favorite';

const apiUrl = env.API_URL;

export default (fetcher = fetch) => {
  /**
   * Executes a search
   */
  const search = async (
    { lang, location, category, coordinates, type, distance, options = { page: 1 } }: SearchParams,
    commonHeaders: RequestOptions
  ): Promise<SearchResult> => {
    const url = `${apiUrl}/new-search/${lang}`;

    const headers = {
      'Content-Type': 'application/json',
      ...commonHeaders
    };

    const body = {
      category,
      location: {
        geoValue: location,
        geoType: type,
        coordinates,
        distance
      }
    };

    const placesResult: ApiSearchResults = await fetcher(url, {
      method: 'POST',
      body: JSON.stringify({
        ...body,
        placeType: PlaceType.PLACE,
        options: { ...options, limit: 100, sortBy: 'distance' }
      }),
      headers
    });

    const parcoursResult: ApiSearchResults = await fetcher(url, {
      method: 'POST',
      body: JSON.stringify({
        ...body,
        placeType: PlaceType.ITINERARY,
        options: { ...options, limit: 10, sortBy: 'distance' }
      }),
      headers
    });

    return buildSearchResultWithParcours(
      placesResult,
      parcoursResult,
      {
        geoType: type,
        coordinates,
        distance
      },
      category as Categories | null
    );
  };

  /**
   * Get place details
   */
  const placeDetails = async (
    { identifier, lang }: PlaceDetailsParams,
    commonHeaders: RequestOptions,
    categorySearched: Categories | null,
    crossingPointIndex?: number
  ): Promise<PlaceDetails> => {
    const url = `${apiUrl}/place/${identifier}/${lang}`;

    const headers = {
      'Content-Type': 'application/json',
      ...commonHeaders
    };

    const placeResult: ApiPlace = await fetcher(url, {
      method: 'GET',
      headers
    });

    return buildPlaceDetails(placeResult, categorySearched, lang, crossingPointIndex);
  };

  /**
   * Lookup places by IDs
   */
  const lookup = async (
    {
      lang,
      favorites
    }: {
      lang: string;
      favorites: FavoriteItem[];
    },
    commonHeaders: RequestOptions
  ): Promise<SearchFavorisResult> => {
    if (!Array.isArray(favorites) || favorites.length === 0) {
      return {
        nbResults: 0,
        places: []
      };
    }

    const ids = [...new Set(favorites.map(({ lieuId }) => lieuId))];

    const url = `${apiUrl}/place/lookup/${lang}`;

    const headers = {
      'Content-Type': 'application/json',
      ...commonHeaders
    };

    const placesResult: ApiSearchResults = await fetcher(url, {
      method: 'POST',
      body: JSON.stringify({
        ids,
        placeType: PlaceType.PLACE
      }),
      headers
    });

    return buildLookupResult(placesResult, favorites);
  };

  return {
    placeDetails,
    search,
    lookup
  };
};
