import { CommonDayOpeningHours, PlaceType, WEEK_DAYS } from "@soliguide/common";

/**
 * @param  {Object} day a week day (monday, tuesday, etc.)
 * @param  {String} placeType place type
 */
export const isValidDay = (
  day: CommonDayOpeningHours,
  placeType: PlaceType = PlaceType.PLACE
): boolean => {
  if (typeof day.open !== "boolean") {
    throw new Error("The field open is not a boolean");
  }

  const timeslot = day.timeslot;

  if (day.open && timeslot.length === 0 && placeType === PlaceType.ITINERARY) {
    throw new Error("At least one timeslot has to be set for an opening day");
  }

  if (timeslot.length >= 4 && placeType !== PlaceType.ITINERARY) {
    throw new Error("3 timeslots maximum allowed in a day");
  }

  for (let i = 0; i < timeslot.length; i++) {
    if (timeslot[i].start > timeslot[i].end) {
      throw new Error(
        "The beginning hour of a timeslot can't be greater than the ending hour of the same timeslot"
      );
    }

    if (timeslot[i + 1]) {
      if (timeslot[i].end > timeslot[i + 1].start) {
        throw new Error(
          "The beginning hour of a timeslot can't be lower than the ending hour of the previous timeslot"
        );
      }
    }
  }

  return true;
};

export const isValidHoursObject = (
  hours: any,
  placeType: PlaceType = PlaceType.PLACE
): boolean => {
  for (const element of WEEK_DAYS) {
    try {
      isValidDay(hours[element], placeType);
    } catch (e) {
      throw new Error(`${e.toString()} (${element})`);
    }
  }
  return true;
};
