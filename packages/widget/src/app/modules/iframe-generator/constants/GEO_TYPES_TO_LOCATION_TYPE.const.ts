import { GeoTypes } from "@soliguide/common";
import { LocationType } from "../types";

export const GEO_TYPES_TO_LOCATION_TYPE: {
  [value in GeoTypes]?: LocationType;
} = {
  [GeoTypes.CITY]: LocationType.CITIES,
  [GeoTypes.DEPARTMENT]: LocationType.DEPARTMENTS,
  [GeoTypes.REGION]: LocationType.REGIONS,
};
