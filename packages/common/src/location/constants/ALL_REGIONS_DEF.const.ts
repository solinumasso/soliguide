import { SoliguideCountries } from "../enums";
import { RegionDef } from "../interfaces";
import { AD_REGIONS_DEF } from "./AD";
import { ES_REGIONS_DEF } from "./ES/ES_REGIONS_DEF.const";
import { FR_REGIONS_DEF } from "./FR/FR_REGIONS_DEF.const";

export const ALL_REGIONS_DEF: {
  [key in SoliguideCountries]: Array<RegionDef<SoliguideCountries>>;
} = {
  fr: FR_REGIONS_DEF,
  es: ES_REGIONS_DEF,
  ad: AD_REGIONS_DEF,
};
