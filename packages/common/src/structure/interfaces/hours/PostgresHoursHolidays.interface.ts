import type { PlaceClosedHolidays } from "../../../hours";

export interface PostgresHoursHolidays {
  id: string;
  holidays: PlaceClosedHolidays;
  description: string;
}
