import { OpeningHoursContext } from "../enums";
import {
  formatStringTime,
  formatTimeSlotForAdmin,
  formatTimeSlotForPublic,
} from "../functions";

export class CommonTimeslot {
  public end: number | string;
  public start: number | string;

  constructor(timeSlot: CommonTimeslot, context?: OpeningHoursContext) {
    // Convert text to integer values
    if (!context || context === OpeningHoursContext.API) {
      this.start = formatStringTime(timeSlot.start);
      this.end = formatStringTime(timeSlot.end);
    } else if (
      (context === OpeningHoursContext.ADMIN ||
        context === OpeningHoursContext.PUBLIC) &&
      typeof timeSlot.end === "number" &&
      typeof timeSlot.start === "number"
    ) {
      this.end =
        context === OpeningHoursContext.ADMIN
          ? formatTimeSlotForAdmin(timeSlot.end)
          : formatTimeSlotForPublic(timeSlot.end);
      this.start =
        context === OpeningHoursContext.ADMIN
          ? formatTimeSlotForAdmin(timeSlot.start)
          : formatTimeSlotForPublic(timeSlot.start);
    } else {
      this.end = 0;
      this.start = 0;
    }
  }
}
