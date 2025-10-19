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
import { type ApiSearchResults } from '@soliguide/common';
import { buildLightPlaceCard } from './searchResult';
import type { SearchFavorisResult } from './types';

/**
 * Builds a lookup result from a places query (for favorites)
 * Does not sort services by category relevance since there's no search context
 */
const buildLookupResult = (placesResult: ApiSearchResults): SearchFavorisResult => {
  const placesResultItems = placesResult.places.map((place) =>
    buildLightPlaceCard(place, place.services_all)
  );

  return {
    nbResults: placesResult.nbResults,
    places: placesResultItems
  };
};

export { buildLookupResult };
