import {
  FR_REGION_CODES,
  ES_REGION_CODES,
  AD_REGION_CODES,
} from "../constants";

export interface RegionCodeMappings {
  fr: (typeof FR_REGION_CODES)[number];
  es: (typeof ES_REGION_CODES)[number];
  ad: (typeof AD_REGION_CODES)[number];
}

export type RegionCode<CountryCode extends keyof RegionCodeMappings> =
  RegionCodeMappings[CountryCode];

export type AnyRegionCode = RegionCodeMappings[keyof RegionCodeMappings];
