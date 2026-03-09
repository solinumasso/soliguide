import type { DayName } from "../../../dates";

export interface PostgresHours {
  index: number;
  id: string;
  day: DayName;
  start: number;
  end: number;
}
