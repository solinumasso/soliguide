import { DayName } from "@soliguide/common";

import { format, isValid } from "date-fns";

export const isValidDate = (value: string | Date) => {
  if (!value) {
    return false;
  } else if (typeof value === "string") {
    value = new Date(value);
  }
  return isValid(value);
};

export const getTodayName = (value: Date | string): DayName => {
  if (typeof value === "string") {
    value = new Date(value);
  }
  if (!isValidDate(value)) {
    throw new Error("The provided value isn't a date");
  }
  return format(value, "EEEE").toLowerCase() as DayName;
};
