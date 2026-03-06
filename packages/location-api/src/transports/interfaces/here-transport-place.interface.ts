import { TransportPlace } from "@soliguide/common";

export interface HereTransportPlace extends TransportPlace {
  type: string;
  wheelchairAccessible?: "yes" | "no";
  id: string;
}
