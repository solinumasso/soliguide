import {
  LocationAutoCompleteAddress,
  GeoTypes,
  slugLocation,
} from "@soliguide/common";
import { GEO_TYPES_KEYS } from "../constants";

export const getGeoValue = (position: LocationAutoCompleteAddress): string => {
  if (
    GeoTypes.BOROUGH === position.geoType ||
    GeoTypes.CITY === position.geoType
  ) {
    return `${slugLocation(position.city)}-${position.postalCode}`;
  } else if (GeoTypes.DEPARTMENT === position.geoType) {
    return `${GEO_TYPES_KEYS[position.country].departement}-${slugLocation(
      position.department
    )}`;
  } else if (GeoTypes.REGION === position.geoType) {
    return `${GEO_TYPES_KEYS[position.country].region}-${slugLocation(
      position.region
    )}`;
  }
  return slugLocation(position.label);
};
