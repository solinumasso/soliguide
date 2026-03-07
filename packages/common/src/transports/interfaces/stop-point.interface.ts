import { StopPointMode } from "../enums/StopPointMode.enum";

export interface StopPoint {
  mode: StopPointMode;
  name: string;
  color: string;
  textColor: string;
  headsign: string;
}
