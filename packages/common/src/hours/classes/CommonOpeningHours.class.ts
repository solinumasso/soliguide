import { OpeningHoursContext, PlaceClosedHolidays } from "../enums";
import { CommonDayOpeningHours } from "./CommonDayOpeningHours.class";

export class CommonOpeningHours {
  public monday: CommonDayOpeningHours;
  public tuesday: CommonDayOpeningHours;
  public wednesday: CommonDayOpeningHours;
  public thursday: CommonDayOpeningHours;
  public friday: CommonDayOpeningHours;
  public saturday: CommonDayOpeningHours;
  public sunday: CommonDayOpeningHours;
  public closedHolidays: PlaceClosedHolidays;
  public description: string | null;

  constructor(
    openingHours?: Partial<CommonOpeningHours>,
    context?: OpeningHoursContext
  ) {
    this.monday = new CommonDayOpeningHours(openingHours?.monday, context);
    this.tuesday = new CommonDayOpeningHours(openingHours?.tuesday, context);
    this.wednesday = new CommonDayOpeningHours(
      openingHours?.wednesday,
      context
    );
    this.thursday = new CommonDayOpeningHours(openingHours?.thursday, context);
    this.friday = new CommonDayOpeningHours(openingHours?.friday, context);
    this.saturday = new CommonDayOpeningHours(openingHours?.saturday, context);
    this.sunday = new CommonDayOpeningHours(openingHours?.sunday, context);

    this.description = openingHours?.description ?? "";
    this.closedHolidays =
      openingHours?.closedHolidays ?? PlaceClosedHolidays.UNKNOWN;
  }
}
