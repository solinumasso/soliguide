
import { OtherNames } from "./OtherNames.interface";
import { SoliguideCountries } from "../enums";
import { DepartmentCode, RegionCode, TimeZone } from "../types";

export type DepartmentInfo<CountryCode extends SoliguideCountries> = Record<
  string,
  DepartmentInfoContent<CountryCode>
>;

export interface DepartmentInfoContent<CountryCode extends SoliguideCountries> {
  departmentName: string;
  departmentCode: DepartmentCode<CountryCode>;
  otherNames?: OtherNames[];
  regionCode: RegionCode<CountryCode>;
  regionName: string;
  coordinates?: number[];
  slug: string;
  timeZone: TimeZone<CountryCode>;
}
