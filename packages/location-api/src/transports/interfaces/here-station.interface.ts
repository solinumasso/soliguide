import { HereStopPoint } from "./here-stop-point.interface";
import { HereTransportPlace } from "./here-transport-place.interface";

export interface HereTransportStation {
  place: HereTransportPlace;
  transports: HereStopPoint[];
}

export interface HereTransportApiResults {
  stations: HereTransportStation[];
}
