import { CommonOpeningHours } from "./CommonOpeningHours.class";
import { OpeningHoursContext } from "../enums";

import { isOneDayOpen, is24HoursOpen } from "../functions";

export class OpeningHours extends CommonOpeningHours {
  public h24: boolean;
  public isOpeningHoursSet: boolean;

  constructor(hours?: CommonOpeningHours, isInForm?: boolean) {
    super(
      hours,
      isInForm ? OpeningHoursContext.ADMIN : OpeningHoursContext.PUBLIC
    );
    this.isOpeningHoursSet = isOneDayOpen(hours);
    this.h24 = is24HoursOpen(hours);
  }
}
