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
  type CommonPlaceService,
  PlaceClosedHolidays,
  PlaceStatus,
} from "@soliguide/common";

import { getTodayName } from "../../_utils/functions/dates/date.functions";
import holidaysService from "../services/holidays.service";

/**
 * @summary Tells whether the place is open today
 * @param {Object} place
 */
export const isPlaceOpenToday = async (place: ApiPlace): Promise<boolean> => {
  if (place.status === PlaceStatus.PERMANENTLY_CLOSED) {
    return false;
  } else {
    const today = new Date();
    const day = getTodayName(today);

    // We check whether it's a day off
    const isHoliday = await holidaysService.isDayHolidayForPostalCode(place);

    // If it's a day off and the place is closed on days off, then it's closed
    if (
      isHoliday &&
      place.newhours.closedHolidays === PlaceClosedHolidays.CLOSED
    ) {
      return false;
    }

    // Effective temporary closures
    if (
      place.tempInfos.closure.actif &&
      place.tempInfos.closure.dateDebut <= today
    ) {
      return false;
    }

    // Effective temporary opening hours
    if (
      place.tempInfos.hours.actif &&
      place.tempInfos.hours.dateDebut <= today
    ) {
      return place.tempInfos.hours.hours[day].open;
    }

    return place.newhours[day].open;
  }
};

export const isServiceOpenToday = async (
  service: CommonPlaceService,
  place: Pick<
    ApiPlace,
    | "parcours"
    | "position"
    | "status"
    | "newhours"
    | "placeType"
    | "tempInfos"
    | "country"
  >
): Promise<boolean> => {
  if (place.status === PlaceStatus.PERMANENTLY_CLOSED) {
    return false;
  } else {
    const today = new Date();
    const day = getTodayName(today);

    // We check whether it's a day off
    const isHoliday = await holidaysService.isDayHolidayForPostalCode(place);

    // If it's a day off and the place is closed on days off, then it's closed
    if (
      isHoliday &&
      place.newhours.closedHolidays === PlaceClosedHolidays.CLOSED
    ) {
      return false;
    }

    // Effective temporary closures
    if (
      (service.close.actif &&
        service.close.dateDebut &&
        service.close.dateDebut <= today) ||
      (place.tempInfos.closure.actif &&
        place.tempInfos.closure.dateDebut <= today)
    ) {
      return false;
    }

    // Effective temporary opening hours
    if (
      !service.differentHours &&
      place.tempInfos.hours.actif &&
      place.tempInfos.hours.dateDebut <= today
    ) {
      return place.tempInfos.hours.hours[day].open;
    }

    return service.hours[day].open;
  }
};
