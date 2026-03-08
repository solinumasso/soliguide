import { LocationAutoCompleteAddress } from "../interfaces";
import { LocationAreas } from "./LocationAreas.class";

export class GeoPosition extends LocationAutoCompleteAddress {
  public areas: LocationAreas; // @deprecated
  public distance: number;

  constructor(data: Partial<GeoPosition>) {
    super(data);
    this.areas = new LocationAreas(data);
    this.distance = data?.distance ?? 5;
  }
}
