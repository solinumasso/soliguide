
import { SoliguideCountries } from "../enums";
import { DepartmentCode } from "../types";
import { OtherNames } from "./OtherNames.interface";

export interface DepartmentDef<CountryCode extends SoliguideCountries> {
  departmentCode: DepartmentCode<CountryCode>;
  departmentName: string;
  isoCode?: string;
  subdivisionShortName?: string; // if exists, ShortName from subdivisions.csv file of openholidaysapi.data
  schoolZoneShortName?: string; // if exists, ShortName from schoolzones.csv file of openholidaysapi.data for ZA, ZB, ZC
  otherNames?: OtherNames[];
  slug?: string;
  coordinates?: number[];
}
