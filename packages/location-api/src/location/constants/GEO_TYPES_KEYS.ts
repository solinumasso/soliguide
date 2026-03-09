import { SoliguideCountries, GeoTypes, CountryCodes } from "@soliguide/common";

export const GEO_TYPES_KEYS: {
  [key in SoliguideCountries]?: {
    [GeoTypes.REGION]: string;
    [GeoTypes.DEPARTMENT]: string;
  };
} = {
  [CountryCodes.FR]: {
    [GeoTypes.REGION]: "region",
    [GeoTypes.DEPARTMENT]: "departement",
  },
  [CountryCodes.ES]: {
    [GeoTypes.REGION]: "comunidad-autonoma",
    [GeoTypes.DEPARTMENT]: "provincia",
  },
  [CountryCodes.AD]: {
    [GeoTypes.REGION]: "parroquia",
    [GeoTypes.DEPARTMENT]: "parroquia",
  },
};
