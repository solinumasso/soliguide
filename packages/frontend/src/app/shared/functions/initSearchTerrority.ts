import {
  type AnyDepartmentCode,
  DEPARTMENTS_MAP,
  type SoliguideCountries,
  DepartmentInfoContent,
  getAllowedTerritories,
} from "@soliguide/common";
import type { User } from "../../modules/users/classes";
import { THEME_CONFIGURATION } from "../../models";

export const initSearchAdminTerritory = (
  territories?: AnyDepartmentCode[],
  user?: User
): AnyDepartmentCode[] => {
  if (!user) {
    return [];
  }

  const allowedTerritories: AnyDepartmentCode[] = getAllowedTerritories(
    user,
    THEME_CONFIGURATION.country
  );

  return territories?.length
    ? territories.filter((dep) => allowedTerritories.includes(dep))
    : allowedTerritories;
};

export function filterDepartments(
  user: User
): DepartmentInfoContent<SoliguideCountries>[] {
  const allowedTerritories = getAllowedTerritories(
    user,
    THEME_CONFIGURATION.country
  );

  const ALL_DEPARTMENTS = DEPARTMENTS_MAP[THEME_CONFIGURATION.country];

  return Object.values<DepartmentInfoContent<SoliguideCountries>>(
    ALL_DEPARTMENTS
  ).filter((dep) => allowedTerritories.includes(dep.departmentCode));
}
