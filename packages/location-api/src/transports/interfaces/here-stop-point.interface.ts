import { HereTransitMode } from "../types/here-transit-mode.type";
export interface HereStopPoint {
  mode: HereTransitMode;
  name: string;
  color: string;
  textColor: string;
  headsign: string;
}
