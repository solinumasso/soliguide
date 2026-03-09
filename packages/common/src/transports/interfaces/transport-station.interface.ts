import { StopPoint } from "./stop-point.interface";
import { TransportPlace } from "./transport-place.interface";

export interface TransportStation {
  place: TransportPlace;
  transports: StopPoint[];
}

export interface TransportApiResults {
  stations: TransportStation[];
}
