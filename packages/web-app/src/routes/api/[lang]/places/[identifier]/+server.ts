import { json, type RequestEvent } from '@sveltejs/kit';
import getPlaceDetailsService from '$lib/server/services/placesService';
import { getHeaders } from '$lib/server/services/headers';
import { getCategoryServiceForTheme } from '$lib/services/categoryService';
import { ensureLanguageLoaded } from '$lib/client/i18n';
import type { PlaceDetailsParams } from '$lib/services/types';
import type { Categories } from '@soliguide/common';

/**
 * Get headers from a request event
 */
export const POST = async (requestEvent: RequestEvent): Promise<Response> => {
  const { identifier, lang } = requestEvent.params;
  const {
    categorySearched,
    crossingPointIndex
  }: { categorySearched: Categories | null; crossingPointIndex: number | null } =
    await requestEvent.request.json();
  const headers = getHeaders(requestEvent);

  // Publics are translated with this language while building the details, and
  // catalogs are loaded on demand: without this the process could answer with
  // raw translation keys
  await ensureLanguageLoaded(lang ?? '');

  const placeDetailService = getPlaceDetailsService(
    getCategoryServiceForTheme(requestEvent.locals.theme.name)
  );
  const result = await placeDetailService.placeDetails(
    {
      lang,
      identifier
    } as PlaceDetailsParams,
    headers,
    categorySearched,
    ...(typeof crossingPointIndex === 'number' ? [crossingPointIndex] : [])
  );

  return json({ ...result }, { status: 201 });
};
