import { WEEK_DAYS, DayName } from "../../dates";
import { CommonOpeningHours } from "../classes/CommonOpeningHours.class";

export const isOneDayOpen = (hours?: CommonOpeningHours): boolean => {
  if (hours) {
    for (const day of WEEK_DAYS) {
      if (hours[day as DayName].open) {
        return true;
      }
    }
  }
  return false;
};

export const is24HoursOpen = (hours?: CommonOpeningHours | null): boolean => {
  if (!hours) return false;

  for (const day of WEEK_DAYS) {
    const timeslot = hours[day as DayName]?.timeslot[0];
    if (!timeslot || timeslot.start !== 0 || timeslot.end !== 2359) {
      return false;
    }
  }
  return true;
};
