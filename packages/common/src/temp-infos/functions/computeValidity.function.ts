import { differenceInCalendarDays } from "date-fns";
import { InfoColor } from "../types";
import { TempInfoStatus } from "../enums";

export const computeValidity = (
  startDate: Date | null,
  endDate: Date | null
): {
  active: boolean;
  infoColor: InfoColor;
  status: TempInfoStatus | null;
} => {
  const result: {
    active: boolean;
    infoColor: InfoColor;
    status: TempInfoStatus | null;
  } = {
    active: false,
    infoColor: "",
    status: null,
  };

  if (!startDate) {
    return result;
  }

  // Today
  const now = new Date();

  // Difference between the beginning date and today
  const diffStartDateAndNow = differenceInCalendarDays(startDate, now);
  // Difference between the ending date and today
  const diffEndDateAndNow = endDate
    ? differenceInCalendarDays(endDate, now)
    : 0;

  if (diffStartDateAndNow <= 15 && diffEndDateAndNow >= 0) {
    result.active = true;
  }

  if (result.active) {
    const isCurrent = diffStartDateAndNow <= 0;

    result.infoColor = isCurrent
      ? "danger" // From start day until the end
      : "warning"; // 15 days before the start date;
    result.status = isCurrent
      ? TempInfoStatus.CURRENT
      : TempInfoStatus.INCOMING;

    return result;
  }

  if (diffStartDateAndNow > 15 && diffEndDateAndNow >= 0) {
    result.status = TempInfoStatus.FUTURE;
    return result;
  }

  result.status = TempInfoStatus.OBSOLETE;
  return result;
};
