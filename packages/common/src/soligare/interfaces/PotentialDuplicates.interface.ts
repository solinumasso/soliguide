import { CommonPlacePosition } from "../../place";

export interface PotentialDuplicates {
  id: string;
  duplicates: number[];
  name: string;
  position: CommonPlacePosition;
}
