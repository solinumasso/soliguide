import get from "lodash.get";
import { CommonUser, UserStatus } from "../../users";
import { DEPARTMENT_CODES } from "../constants";
import { SoliguideCountries } from "../enums";
import { AnyDepartmentCode } from "../types";
import { ApiOrganization } from "../../organization";

export const getTerritoriesFromAreas = (
  organizationOrUser:
    | Pick<CommonUser, "status" | "areas">
    | Pick<ApiOrganization, "areas">,
  country: SoliguideCountries
): AnyDepartmentCode[] => {
  if (!organizationOrUser) {
    return [];
  }
  if (
    (organizationOrUser as CommonUser)?.status === UserStatus.ADMIN_SOLIGUIDE
  ) {
    return DEPARTMENT_CODES[country];
  }
  return get(organizationOrUser, `areas.${country}.departments`, []);
};
