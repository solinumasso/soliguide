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
