import { DayName } from "@soliguide/common";

// Week start with current day
export const weekDaysOrdering = (
  weekDays: DayName[],
  indexToday: number
): DayName[] => {
  return weekDays.slice(indexToday).concat(weekDays.slice(0, indexToday));
};
