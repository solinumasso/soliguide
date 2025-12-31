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
