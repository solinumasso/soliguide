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
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { getPlaceDetailsPageController } from './pageController';
import { PlaceOpeningStatus, PlaceTempInfos } from '@soliguide/common';
import { get } from 'svelte/store';
import type { PlaceDetails } from '$lib/models/types';
import type { PageController } from './types';

const defaultState: PlaceDetails = {
  address: '',
  description: '',
  email: '',
  facebook: '',
  fax: '',
  hours: {},
  id: 7,
  info: [],
  instagram: '',
  lastUpdate: '',
  name: '',
  onOrientation: false,
  phones: [],
  services: [],
  sources: [],
  status: PlaceOpeningStatus.OPEN,
  todayInfo: {},
  tempInfos: {} as PlaceTempInfos,
  website: ''
};

describe('PlaceDetailsPageController', () => {
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  // skipcq: JS-0119
  let pageState: PageController;

  beforeEach(() => {
    pageState = getPlaceDetailsPageController();
  });

  describe('Test place hours details', () => {
    it('each day should exist', () => {
      pageState.init({
        ...defaultState,
        hours: {
          monday: [{ start: '0900', end: '1700' }],
          wednesday: [{ start: '0900', end: '1700' }],
          friday: [{ start: '0900', end: '1700' }],
          sunday: []
        }
      });
      const { hours } = get(pageState).placeDetails;
      expect(Object.keys(hours).length).toEqual(daysOfWeek.length);
    });
    it('each key should be a valid day of the week', () => {
      pageState.init({
        ...defaultState,
        hours: {
          monday: [{ start: '0900', end: '1700' }],
          wednesday: [{ start: '0900', end: '1700' }],
          friday: [{ start: '0900', end: '1700' }],
          sunday: []
        }
      });
      const { hours } = get(pageState).placeDetails;
      const keys = Object.keys(hours);
      keys.forEach((key) => {
        expect(daysOfWeek).toContain(key);
      });
    });
    it('the first day in the list should be today', () => {
      vi.setSystemTime(new Date(2024, 9, 18)); //Friday
      pageState.init({
        ...defaultState,
        hours: {
          monday: [{ start: '0900', end: '1700' }],
          tuesday: [{ start: '0900', end: '1700' }],
          wednesday: [{ start: '0900', end: '1700' }],
          thursday: [{ start: '0900', end: '1700' }],
          friday: [{ start: '0900', end: '1700' }],
          saturday: [],
          sunday: []
        }
      });
      const today = 'friday';
      const { placeDetails, currentDay } = get(pageState);
      const { hours } = placeDetails;
      const reorderedDays = Object.keys(hours);
      expect(reorderedDays[0]).toEqual(today);
      expect(currentDay).toEqual(today);
    });
    it('should correctly reorder the days starting with today', () => {
      vi.setSystemTime(new Date(2024, 9, 18)); //Friday
      pageState.init({
        ...defaultState,
        hours: {
          monday: [{ start: '0900', end: '1700' }],
          tuesday: [{ start: '0900', end: '1700' }],
          wednesday: [{ start: '0900', end: '1700' }],
          thursday: [{ start: '0900', end: '1700' }],
          friday: [{ start: '0900', end: '1700' }],
          saturday: [],
          sunday: []
        }
      });

      const expectedOrder = [
        'friday',
        'saturday',
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday'
      ];

      const { placeDetails } = get(pageState);
      const { hours } = placeDetails;
      const reorderedDays = Object.keys(hours);
      expect(reorderedDays).toEqual(expectedOrder);
    });

    it('should correctly reorder the days when initialized in a different order', () => {
      pageState.init({
        ...defaultState,
        hours: {
          wednesday: [{ start: '0900', end: '17s00' }],
          friday: [{ start: '0900', end: '17s00' }],
          tuesday: [{ start: '0900', end: '17s00' }],
          monday: [{ start: '0900', end: '17s00' }],
          sunday: [],
          thursday: [{ start: '0900', end: '17s00' }],
          saturday: []
        }
      });

      const { placeDetails } = get(pageState);
      const { hours } = placeDetails;
      const reorderedDays = Object.keys(hours);
      const expectedOrder = [
        'friday',
        'saturday',
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday'
      ];

      expect(reorderedDays).toEqual(expectedOrder);
    });

    it('should show "fermé" for days with no hours', () => {
      pageState.init({
        ...defaultState,
        hours: {
          monday: [{ start: '0900', end: '1700' }],
          tuesday: [],
          wednesday: [{ start: '0900', end: '1700' }],
          thursday: [{ start: '0900', end: '1700' }],
          friday: [{ start: '0900', end: '1700' }],
          sunday: []
        }
      });

      const { placeDetails } = get(pageState);
      const { hours } = placeDetails;

      expect(hours.tuesday).toEqual([]);
      expect(hours.saturday).toEqual([]);
    });
  });
});
