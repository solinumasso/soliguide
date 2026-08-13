import { json, type RequestEvent } from '@sveltejs/kit';
import getSearchService from '$lib/server/services/placesService';
import { getDistanceFromGeoType } from '$lib/models/locationSuggestion';
import { getHeaders } from '$lib/server/services/headers';
import { getCategoryServiceForTheme } from '$lib/services/categoryService';
import { ALL_CATEGORIES } from '$lib/constants';

/**
 * Get headers from a request event
 */
export const POST = async (requestEvent: RequestEvent): Promise<Response> => {
  const { location, category, coordinates, type, openToday, modalities, options } =
    await requestEvent.request.json();
  const { lang } = requestEvent.params;

  const headers = getHeaders(requestEvent);

  // Convert ALL_CATEGORIES to null for the API
  const apiCategory = category === ALL_CATEGORIES ? null : category;

  const searchService = getSearchService(
    getCategoryServiceForTheme(requestEvent.locals.theme.name)
  );
  const result = await searchService.search(
    {
      lang: lang ?? '',
      location,
      category: apiCategory,
      coordinates,
      type,
      distance: getDistanceFromGeoType(type),
      // Taken from the resolved theme, so a country never leaks results from another
      country: requestEvent.locals.theme.country,
      openToday,
      modalities,
      options
    },
    headers
  );

  return json(result, { status: 201 });
};
