import { env } from '$env/dynamic/private';
import { Categories, PlaceType, type ApiPlace, type ApiSearchResults } from '@soliguide/common';
import { fetch } from '$lib/client';
import { buildSearchResultWithParcours } from '$lib/models/searchResult';
import { buildLookupResult } from '$lib/models/lookupResult';
import { buildPlaceDetails } from '$lib/models/placeDetails';
import type { RequestOptions, SearchParams } from './types';
import type { PlaceDetails, SearchFavorisResult, SearchResult } from '$lib/models/types';
import type { FavoriteItem } from '$lib/models/favorite';
import type { CategoryService, PlaceDetailsParams } from '$lib/services/types';

const apiUrl = env.API_URL;

/**
 * The category service is injected because the taxonomy depends on the country
 * of the request: it can never be captured at module load time.
 */
export default (categoryService: CategoryService, fetcher = fetch) => {
  /**
   * Executes a search
   */
  const search = async (
    {
      lang,
      location,
      category,
      coordinates,
      type,
      distance,
      country,
      openToday,
      modalities,
      options = { page: 1 }
    }: SearchParams,
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
        distance,
        country
      },
      openToday,
      modalities
    };

    const placesRequestBody = {
      ...body,
      placeType: PlaceType.PLACE,
      options: { ...options, limit: 100, sortBy: 'distance' }
    };

    const parcoursRequestBody = {
      ...body,
      placeType: PlaceType.ITINERARY,
      options: { ...options, limit: 10, sortBy: 'distance' }
    };

    const placesResult: ApiSearchResults = await fetcher(url, {
      method: 'POST',
      body: JSON.stringify(placesRequestBody),
      headers
    });

    const parcoursResult: ApiSearchResults = await fetcher(url, {
      method: 'POST',
      body: JSON.stringify(parcoursRequestBody),
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
      category as Categories | null,
      categoryService
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

    return buildPlaceDetails(
      placeResult,
      categorySearched,
      lang,
      categoryService,
      crossingPointIndex
    );
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
