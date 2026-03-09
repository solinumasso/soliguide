import { OpeningHoursContext } from "../enums";
import { CommonTimeslot } from "./CommonTimeSlot.class";

export class CommonDayOpeningHours {
  public open: boolean;
  public timeslot: CommonTimeslot[];

  constructor(
    dayHour?: Partial<CommonDayOpeningHours>,
    context?: OpeningHoursContext
  ) {
    this.timeslot = [];

    if (dayHour?.timeslot) {
      dayHour.timeslot
        .filter(
          (timeSlot: CommonTimeslot) => timeSlot.end && timeSlot.start != null // check null of undefined to include a possible start at 0
        )
        .sort((timeSlotA, timeSlotB) => {
          if (timeSlotA.start < timeSlotB.start) {
            return -1;
          }
          if (timeSlotA.start > timeSlotB.start) {
            return 1;
          }
          return 0;
        })
        .forEach((timeSlot: CommonTimeslot) =>
          this.timeslot.push(new CommonTimeslot(timeSlot, context))
        );
    }
    this.open = this.timeslot.length > 0;
  }
}
