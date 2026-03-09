import { FR_REGIONS_DEF } from "../constants";
import { CountryCodes } from "../enums";

import { RegionDef } from "../interfaces";
import { DepartmentCode } from "../types";

export const getDepartmentCodesFromRegionName = (
  regionName: string
): Array<DepartmentCode<CountryCodes.FR>> => {
  if (!regionName) {
    throw new Error("Region name not set");
  }

  const regions: Array<RegionDef<CountryCodes.FR>> = FR_REGIONS_DEF.filter(
    (region: RegionDef<CountryCodes.FR>) => region.regionName === regionName
  );

  const departmentCodes: Array<DepartmentCode<CountryCodes.FR>> = [];
  regions.map((region: RegionDef<CountryCodes.FR>) => {
    return region.departments.map(
      (department: {
        departmentCode: DepartmentCode<CountryCodes.FR>;
        departmentName: string;
      }) => departmentCodes.push(department.departmentCode)
    );
  });

  return departmentCodes.length > 0 ? departmentCodes : [];
};
