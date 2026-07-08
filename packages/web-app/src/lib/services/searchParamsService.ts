import type { LocationSuggestion } from '$lib/models/locationSuggestion';
import type { CategorySearch } from '$lib/constants';
import type { PlacesSearchParams, SearchParamsService } from './types';

/**
 * Service that builds the parameters used to launch a places (search results) search.
 */
export const getSearchParamsService = (): SearchParamsService => {
  /**
   * Build the params needed to launch a places search from a resolved location and a category.
   * The suggestion stores its coordinates as [latitude, longitude].
   */
  const buildPlacesSearchParams = (
    location: LocationSuggestion,
    category: CategorySearch,
    lang: string
  ): PlacesSearchParams => {
    const [latitude, longitude] = location.coordinates;

    return {
      lang,
      location: location.geoValue,
      latitude: String(latitude),
      longitude: String(longitude),
      type: location.geoType,
      label: location.suggestionLabel,
      category
    };
  };

  /**
   * Serialize places search params into a query string usable after ROUTE_PLACES.
   * Optional filters are simply omitted from the object, so they are absent from the query.
   */
  const toPlacesSearchQueryString = (params: PlacesSearchParams): string =>
    new URLSearchParams(Object.entries(params)).toString();

  return {
    buildPlacesSearchParams,
    toPlacesSearchQueryString
  };
};

export const searchParamsService = getSearchParamsService();
