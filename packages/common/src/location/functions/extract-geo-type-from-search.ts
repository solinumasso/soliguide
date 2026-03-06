
import { GEO_TYPES_KEYS } from "../constants";
import { SoliguideCountries, GeoTypes } from "../enums";

export const extractGeoTypeFromSearch = (
  search: string,
  country: SoliguideCountries
): {
  geoType: GeoTypes | null;
  search: string;
} => {
  search = search.toLowerCase().trim();
  const countryGeoTypes = GEO_TYPES_KEYS[country];

  if (!countryGeoTypes) {
    return { geoType: null, search };
  }

  for (const [geoType, prefix] of Object.entries(countryGeoTypes)) {
    if (search.startsWith(`${prefix}-`)) {
      search = search.substring(prefix.length + 1).trim();
      return {
        geoType: geoType as GeoTypes,
        search,
      };
    }
  }

  return { geoType: null, search };
};
