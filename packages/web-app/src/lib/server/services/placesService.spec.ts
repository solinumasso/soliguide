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
import { beforeEach, describe, expect, it } from 'vitest';
import { Categories, GeoTypes, SupportedLanguagesCode } from '@soliguide/common';
import { fakeFetch } from '$lib/client';
import getSearchService from './placesService';
import type { RequestOptions } from './types';

const searchReqOptions: RequestOptions = {
  origin: 'me',
  referer: 'metoo',
  'X-Ph-User-Session-Id': 'session-id',
  'X-Ph-User-Distinct-Id': 'user-id'
};

describe('Search Service', () => {
  const { fetch, feedWith, setError } = fakeFetch();
  let service = getSearchService();

  beforeEach(() => {
    service = getSearchService(fetch);
    feedWith([]);
    setError(null);
  });

  describe('When searching with a location, a category and a theme', () => {
    it('We get data', async () => {
      feedWith({ nbResults: 0, places: [] });
      const result = await service.search(
        {
          lang: SupportedLanguagesCode.FR,
          location: 'toto',
          category: Categories.FOOD,
          coordinates: [1.234, 8.7654],
          type: GeoTypes.CITY,
          distance: 50,
          options: { page: 1 },
          department: '',
          departmentCode: '',
          region: '',
          regionCode: '',
          country: ''
        },
        searchReqOptions
      );
      expect(result).toEqual({ nbResults: 0, places: [] });
    });
  });
});
