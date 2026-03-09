import get from "lodash.get";
import { CommonUser, UserStatus } from "../../users";
import { DEPARTMENT_CODES } from "../constants";
import { SoliguideCountries } from "../enums";
import { AnyDepartmentCode } from "../types";

export const getAllowedTerritories = (
  user: Pick<CommonUser, "areas" | "status">,
  country: SoliguideCountries
): AnyDepartmentCode[] => {
  const territoriesField = `areas.${country}.departments`;
  const userTerritories = get(user, territoriesField) ?? [];

  return user.status === UserStatus.ADMIN_SOLIGUIDE ||
    user.status === UserStatus.SOLI_BOT
    ? DEPARTMENT_CODES[country]
    : userTerritories;
};
