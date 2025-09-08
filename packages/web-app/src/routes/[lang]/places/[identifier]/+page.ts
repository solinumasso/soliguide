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
