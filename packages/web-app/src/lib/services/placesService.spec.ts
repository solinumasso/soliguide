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
import { beforeEach, describe, expect, it, vi } from 'vitest';
import getSearchService from './placesService';
import { fakeFetch } from '$lib/client';
import {
  GeoTypes,
  Categories,
  SupportedLanguagesCode,
  CommonPlacePosition
} from '@soliguide/common';

const serviceResult = {
  nbResults: 1,
  places: [
    {
      id: 154,
      seoUrl: 'soupe-saint-eustache-paris-154',
      name: 'Soupe Saint-Eustache',
      status: 'temporarilyClosed',
      hours: { endDate: '2024-11-30T23:59:59.000Z', startDate: '2024-04-01T00:00:00.000Z' },
      address: '1 Rue Montmartre, 75001 Paris',
      dataForLogs: {
        id: '5a58c0c7c1797fe45e377324',
        lieuId: 154,
        distance: 478.42644975047216,
        position: new CommonPlacePosition()
      },
      distance: 478.42644975047216,
      services: ['food_distribution'],
      phones: [{ label: '', phoneNumber: '01 42 36 31 05', countryCode: 'fr' }],
      banners: { message: null, orientation: false, holidays: 'UNKNOWN' }
    }
  ]
};

const validParams = {
  lang: SupportedLanguagesCode.FR,
  location: 'rue-du-departement-75018-paris',
  category: Categories.FOOD,
  latitude: 2.3554445,
  longitude: 48.8381335,
  type: GeoTypes.CITY,
  options: { page: 1 }
};

const invalidParams = {
  lang: SupportedLanguagesCode.FR,
  location: '',
  category: '',
  latitude: 2.3554445,
  longitude: 48.8381335,
  type: '',
  options: { page: 1 }
};

vi.mock('posthog-js');

describe('Search Service', () => {
  const { fetch, feedWith, setError } = fakeFetch();
  let service = getSearchService();

  beforeEach(() => {
    service = getSearchService(fetch);
    feedWith([]);
    setError(null);
  });

  describe('Search places', () => {
    it('I receive data when I call the service with valid params', async () => {
      feedWith(serviceResult);
      const result = await service.searchPlaces(validParams);
      expect(result).toEqual(serviceResult);
    });

    it('I get an error with invalid params', () => {
      feedWith(serviceResult);
      expect(() => service.searchPlaces(invalidParams)).toThrowError('Bad request');
    });

    it('Returns nothing when search has a server error', () => {
      setError({ status: 500, statusText: 'Internal server error' });
      expect(() => service.searchPlaces(validParams)).toThrowError('Internal server error');
    });
  });
});
