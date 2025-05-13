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
import {
  type ApiPlace,
  CommonPlacePosition,
  CommonPlaceSource,
  CommonTimeslot,
  type DayName,
  EXTERNAL_SOURCE_MAPPING,
  PairingSources,
  PlaceOpeningStatus,
  //PlaceTempInfos,
  checkIfSourceMustBeDisplayed,
  computeTempIsActive
} from '@soliguide/common';
import type { HoursRange, Source, TodayInfo } from './types';

/**
 * Calculates the complete address to display
 */
export const computeAddress = (position: CommonPlacePosition, onOrientation: boolean): string => {
  if (onOrientation) {
    return `${position.postalCode}, ${position.city}`;
  } else if (position.additionalInformation) {
    return `${position.address} - ${position.additionalInformation}`;
  }
  return position.address;
};

/**
 * Converts timeslots to formatted hours ranges
 */
export const formatTimeslots = (timeslots: CommonTimeslot[] = []): HoursRange[] =>
  timeslots.map(({ start, end }) => ({
    start: String(start).padStart(4, '0'),
    end: String(end).padStart(4, '0')
  }));

/**
 * Calculates opening hours: date interval, hour interval or nothing and closing days
 */
export const computeTodayInfo = (
  place: ApiPlace,
  status: PlaceOpeningStatus,
  dayToCheck = new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase() as DayName
): TodayInfo => {
  if (status === PlaceOpeningStatus.CLOSED || status === PlaceOpeningStatus.UNKNOWN) {
    return {};
  }

  // [TODO] handle partiallyOpen case
  if (status === PlaceOpeningStatus.OPEN || status === PlaceOpeningStatus.PARTIALLY_OPEN) {
    const isTempHoursActive = computeTempIsActive(place.tempInfos.hours);

    if (isTempHoursActive) {
      return {
        openingHours: formatTimeslots(place.tempInfos.hours?.hours?.[dayToCheck]?.timeslot ?? [])
      };
    }

    return {
      openingHours: formatTimeslots(place.newhours?.[dayToCheck]?.timeslot ?? [])
    };
  }

  // closingDays can have just a start date without an end date
  if (place.tempInfos.closure.actif) {
    const start = new Date(place.tempInfos.closure.dateDebut).toISOString();

    return {
      closingDays: place.tempInfos.closure.dateFin
        ? {
            start,
            end: new Date(place.tempInfos.closure.dateFin).toISOString()
          }
        : {
            start
          }
    };
  }
  return {};
};

/**
 * Transform external sources to front ready sources
 */
export const buildSources = (sources?: CommonPlaceSource[]): Source[] =>
  sources
    ? sources.reduce((acc: Source[], source) => {
        const toDisplay = checkIfSourceMustBeDisplayed(source.name, source.isOrigin);

        if (toDisplay) {
          return [
            ...acc,
            {
              label: EXTERNAL_SOURCE_MAPPING[source.name as PairingSources].label ?? '',
              licenseLabel:
                EXTERNAL_SOURCE_MAPPING[source.name as PairingSources].licenseLabel ?? '',
              licenseLink: EXTERNAL_SOURCE_MAPPING[source.name as PairingSources].licenseLink ?? ''
            }
          ];
        }
        return acc;
      }, [])
    : [];

// export const computeTempInfos = (tempInfos: PlaceTempInfos): PlaceTempInfos => {
//   Object.entries(tempInfos).forEach(([key, value]) => {
//     if (value.actif && value.dateDebut) {
//       return {
//         ...tempInfos,
//         [key]: {
//           ...value,
//           dateDebut: value.dateDebut,
//           dateFin: value.dateFin ? new Date(value.dateFin).toISOString() : null
//         }
//       };
//     }
//     return {
//       ...tempInfos
//     };
//   });
//   return {
//     ...tempInfos
//   };
// };
