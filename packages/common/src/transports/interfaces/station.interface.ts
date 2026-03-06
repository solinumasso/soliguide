import { StopPoint } from "./stop-point.interface";
import { TransportPlace } from "./transport-place.interface";

export interface Station {
  place: TransportPlace & {
    distance?: number;
  };
  transports: Record<string, StopPoint[]>;
}
