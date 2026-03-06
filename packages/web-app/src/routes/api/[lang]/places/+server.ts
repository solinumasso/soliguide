import { json, type RequestEvent } from '@sveltejs/kit';
import getSearchService from '$lib/server/services/placesService';
import { getDistanceFromGeoType } from '$lib/models/locationSuggestion';
import { getHeaders } from '$lib/server/services/headers';
import { ALL_CATEGORIES } from '$lib/constants';

/**
 * Get headers from a request event
 */
export const POST = async (requestEvent: RequestEvent): Promise<Response> => {
  const { location, category, coordinates, type, options } = await requestEvent.request.json();
  const { lang } = requestEvent.params;

  const headers = getHeaders(requestEvent);

  // Convert ALL_CATEGORIES to null for the API
  const apiCategory = category === ALL_CATEGORIES ? null : category;

  const searchService = getSearchService();
  const result = await searchService.search(
    {
      lang: lang ?? '',
      location,
      category: apiCategory,
      coordinates,
      type,
      distance: getDistanceFromGeoType(type),
      options
    },
    headers
  );

  return json(result, { status: 201 });
};
