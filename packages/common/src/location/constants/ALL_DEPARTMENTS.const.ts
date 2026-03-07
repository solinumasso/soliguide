import { CountryCodes, SoliguideCountries } from "../enums";
import { RegionDef, DepartmentInfo, DepartmentDef } from "../interfaces";
import { TimeZone, RegionCode } from "../types";
import { ALL_REGIONS_DEF } from "./ALL_REGIONS_DEF.const";

export function getDepartmentsMap<CountryCode extends SoliguideCountries>(
  country: CountryCode
): DepartmentInfo<CountryCode> {
  const regions = ALL_REGIONS_DEF[country] as Array<RegionDef<CountryCode>>;

  const departments = regions.flatMap((region: RegionDef<CountryCode>) =>
    region.departments.map((dep: DepartmentDef<CountryCode>) => ({
      ...dep,
      regionCode: region.regionCode,
      regionName: region.regionName,
      slug: region.slug,
      timeZone: region.timeZone,
    }))
  );

  // Convert the array of departments into a map keyed by departmentCode
  return departments.reduce<DepartmentInfo<CountryCode>>(
    (
      acc: DepartmentInfo<CountryCode>,
      dep: DepartmentDef<CountryCode> & {
        regionCode: RegionCode<CountryCode>;
        regionName: string;
        slug: string;
        timeZone: TimeZone<CountryCode>;
      }
    ) => {
      acc[dep.departmentCode] = dep;
      return acc;
    },
    {}
  );
}

export const DEPARTMENTS_MAP: {
  [key in SoliguideCountries]: DepartmentInfo<SoliguideCountries>;
} = {
  fr: getDepartmentsMap<CountryCodes.FR>(CountryCodes.FR),
  es: getDepartmentsMap<CountryCodes.ES>(CountryCodes.ES),
  ad: getDepartmentsMap<CountryCodes.AD>(CountryCodes.AD),
} as const;
