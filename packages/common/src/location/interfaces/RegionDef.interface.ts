import { TimeZone } from "../types";
import { SoliguideCountries } from "../enums";
import { RegionCode } from "../types/RegionCode.type";
import { DepartmentDef } from "./DepartmentDef.interface";
import { OtherNames } from "./OtherNames.interface";

export interface RegionDef<CountryCode extends SoliguideCountries> {
  regionCode: RegionCode<CountryCode>;
  regionName: string;
  isoCode?: string;
  subdivisionShortName?: string; // if exists, ShortName from subdivisions.csv file of openholidaysapi.data
  schoolZoneShortName?: string; // if exists, ShortName from schoolzones.csv file of openholidaysapi.data for ZA, ZB, ZC
  slug: string;
  timeZone: TimeZone<CountryCode>;
  coordinates: number[];
  departments: Array<DepartmentDef<CountryCode>>;
  otherNames?: OtherNames[];
}
