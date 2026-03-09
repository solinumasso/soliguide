import { json, type RequestEvent } from '@sveltejs/kit';
import getSearchService from '$lib/server/services/placesService';
import { getHeaders } from '$lib/server/services/headers';

/**
 * Lookup places by IDs
 */
export const POST = async (requestEvent: RequestEvent): Promise<Response> => {
  const requestBody = await requestEvent.request.json();
  const favorites = Array.isArray(requestBody?.favorites) ? requestBody.favorites : [];

  const headers = getHeaders(requestEvent);
  const searchService = getSearchService();
  const result = await searchService.lookup(
    {
      lang: requestEvent.params.lang ?? '',
      favorites
    },
    headers
  );

  return json(result, { status: 200 });
};
