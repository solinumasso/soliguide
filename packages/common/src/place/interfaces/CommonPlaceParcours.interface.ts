/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonPlacePosition } from "../classes/CommonPlacePosition.class";

export interface CommonPlaceParcours {
  description: string;
  hours: any;
  position: CommonPlacePosition;
  photos: any[];
  show?: boolean;
}
