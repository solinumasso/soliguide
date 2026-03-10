import {
  type ApiPlace,
  type CommonPlaceService,
  computeTempIsActive,
  getPosition,
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
  const position = getPosition(place);

  if (
    place.status === PlaceStatus.PERMANENTLY_CLOSED ||
    place.status === PlaceStatus.DRAFT ||
    !position?.country
  ) {
    return false;
  }

  // Effective temporary closures
  if (computeTempIsActive(place.tempInfos.closure)) {
    return false;
  }

  // We check whether it's a day off
  const isHoliday = await holidaysService.isDayHolidayForPostalCode(place);

  if (
    isHoliday &&
    place.newhours.closedHolidays === PlaceClosedHolidays.CLOSED
  ) {
    return false;
  }

  const day = getTodayName(new Date());

  // Effective temporary opening hours
  if (computeTempIsActive(place.tempInfos.hours)) {
    return place.tempInfos.hours.hours?.[day]?.open ?? false;
  }

  return place.newhours[day].open;
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
  const position = getPosition(place);

  if (
    place.status === PlaceStatus.PERMANENTLY_CLOSED ||
    place.status === PlaceStatus.DRAFT ||
    !position?.country
  ) {
    return false;
  }

  // Effective temporary closures (service-level or place-level)
  if (
    computeTempIsActive(service.close) ||
    computeTempIsActive(place.tempInfos.closure)
  ) {
    return false;
  }

  // We check whether it's a day off
  const isHoliday = await holidaysService.isDayHolidayForPostalCode(place);

  if (
    isHoliday &&
    place.newhours.closedHolidays === PlaceClosedHolidays.CLOSED
  ) {
    return false;
  }

  const day = getTodayName(new Date());

  // Effective temporary opening hours (only if service uses place hours)
  if (!service.differentHours && computeTempIsActive(place.tempInfos.hours)) {
    return place.tempInfos.hours.hours?.[day]?.open ?? false;
  }

  return service.hours[day].open;
};
