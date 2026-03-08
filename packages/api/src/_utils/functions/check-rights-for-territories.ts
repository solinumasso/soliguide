import {
  AnyDepartmentCode,
  SoliguideCountries,
  CountryCodes,
  DEPARTMENTS_MAP,
  UserStatus,
  getAllowedTerritories,
} from "@soliguide/common";
import { ExpressRequest, UserPopulateType } from "../../_models";

export const checkRightsForTerritories = (
  territories: AnyDepartmentCode[],
  req: ExpressRequest
): boolean => {
  // 1. Check if country is available
  validateCountry(req.body?.country);

  // 2. Check if territories exist
  validateTerritories(req.body?.country, territories);

  // Admins can access to all territories
  const user: UserPopulateType = req.user;
  if (user.status === UserStatus.ADMIN_SOLIGUIDE) {
    return true;
  }

  return checkUserTerritoryRights(user, territories, req.body?.country);
};

export function validateCountry(country: SoliguideCountries): void {
  if (![CountryCodes.FR, CountryCodes.ES, CountryCodes.AD].includes(country)) {
    throw new Error("COUNTRY_IS_NOT_ALLOWED");
  }
}

export function validateTerritories(
  country: SoliguideCountries,
  territories: AnyDepartmentCode[]
): void {
  const availableTerritories = Object.keys(DEPARTMENTS_MAP[country]);

  territories.forEach((territory) => {
    if (!availableTerritories.includes(territory)) {
      throw new Error(
        `Territory "${territory}" doesn't exist for country ${country}`
      );
    }
  });
}

export function checkUserTerritoryRights(
  user: UserPopulateType,
  territories: AnyDepartmentCode[],
  country: SoliguideCountries
): boolean {
  const userTerritories = getAllowedTerritories(user, country);

  if (!userTerritories?.length) {
    throw new Error(
      `You do not have the rights necessary to seek on this country`
    );
  }

  territories.forEach((territory) => {
    if (!userTerritories.includes(territory)) {
      throw new Error(
        `You do not have the rights necessary to seek on this territory: "${territory}" (country: ${country})`
      );
    }
  });

  return true;
}
