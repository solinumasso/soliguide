import { GeoTypes, CountryCodes } from "../enums";
import { LocationAutoCompleteAddress } from "../interfaces";

export const COUNTRIES_LOCATION: LocationAutoCompleteAddress[] = [
  {
    label: "France",
    coordinates: [2.343837096283199, 48.85058894753169],
    geoType: GeoTypes.COUNTRY,
    geoValue: CountryCodes.FR,
    country: CountryCodes.FR,
    slugs: {
      country: CountryCodes.FR,
      pays: CountryCodes.FR,
    },
  },
  {
    label: "España",
    coordinates: [-3.705510666436781, 40.41668503452932],
    geoType: GeoTypes.COUNTRY,
    country: CountryCodes.ES,
    geoValue: CountryCodes.ES,
    slugs: {
      country: CountryCodes.ES,
      pays: CountryCodes.ES,
    },
  },
  {
    label: "Andorra",
    coordinates: [1.5255804423331272, 42.50583018383308],
    geoType: GeoTypes.COUNTRY,
    geoValue: "andorra",
    country: CountryCodes.AD,
    slugs: {
      country: CountryCodes.AD,
      pays: CountryCodes.AD,
    },
  },
];
