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
