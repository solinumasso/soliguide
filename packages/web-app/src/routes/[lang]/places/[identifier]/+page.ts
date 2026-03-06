import { wrapSveltekitFetch } from '$lib/client';
import type { PlaceDetails } from '$lib/models/types';
import getPlacesService from '$lib/services/placesService';
import type { PlaceDetailsParams } from '$lib/services/types';
import { Categories } from '@soliguide/common';

export const load = ({ params, fetch, url }): Promise<PlaceDetails> => {
  const lang = String(params.lang);
  const identifier = String(params.identifier);

  const categorySearched = url.searchParams.get('categorySearched') as Categories;
  const crossingPointIndex = url.searchParams.get('crossingPointIndex');
  const parsedCrossingPointIndex = crossingPointIndex ? Number(crossingPointIndex) : null;

  // Use service with this version of fetch, works with SSR
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sveltekitFetchImpl = wrapSveltekitFetch<any>(fetch);
  const placesService = getPlacesService(sveltekitFetchImpl);

  return placesService.placeDetails(
    {
      lang,
      identifier
    } as PlaceDetailsParams,
    categorySearched,
    ...(typeof parsedCrossingPointIndex === 'number' ? [parsedCrossingPointIndex] : [])
  );
};
