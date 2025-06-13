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
import { writable } from 'svelte/store';
import { PlaceOpeningStatus, PlaceTempInfo, WEEK_DAYS, type DayName } from '@soliguide/common';
import type { PlaceDetails, PlaceDetailsOpeningHours } from '$lib/models/types';
import { posthogService } from '$lib/services/posthogService';
import type { PageController, PageState } from './types';
import type { PosthogCaptureFunction } from '$lib/services/types';

const getCurrentDay = (): DayName => {
  return new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase() as DayName;
};

const getCurrentDayIndex = (): number => {
  return (new Date().getDay() + 6) % 7;
};

const reorderedDays = (hours: PlaceDetailsOpeningHours): PlaceDetailsOpeningHours => {
  const currentDayIndex = getCurrentDayIndex();
  const orderedDays = [...WEEK_DAYS.slice(currentDayIndex), ...WEEK_DAYS.slice(0, currentDayIndex)];

  return orderedDays.reduce(
    (acc, day) => ({
      ...acc,
      [day]: hours[day] || []
    }),
    {}
  );
};

const initialValue: PageState = {
  placeDetails: {
    // lieu_id 7 does not exist in the database
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
    website: '',
    tempInfo: {} as PlaceTempInfo
  },
  error: null,
  currentDay: getCurrentDay()
};

const captureEvent: PosthogCaptureFunction = (eventName, properties) => {
  posthogService.capture(`place-page-${eventName}`, properties);
};

export const getPlaceDetailsPageController = (): PageController => {
  const pageStore = writable(initialValue);

  const init = (placeData: PlaceDetails): void => {
    const { hours } = placeData;

    pageStore.set({
      ...initialValue,
      placeDetails: { ...placeData, hours: reorderedDays(hours) },
      currentDay: getCurrentDay()
    });
  };

  return {
    subscribe: pageStore.subscribe,
    init,
    captureEvent
  };
};
