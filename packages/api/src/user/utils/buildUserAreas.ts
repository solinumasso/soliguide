import {
  AnyDepartmentCode,
  CountryAreaTerritories,
  DEPARTMENT_CODES,
  getTerritoriesFromAreas,
  SoliguideCountries,
  UserStatus,
} from "@soliguide/common";
import { User } from "../../_models";

export const buildUserAreas = (
  user: Pick<User, "status" | "areas"> & Partial<Pick<User, "territories">>,
  userData: { country: SoliguideCountries; territories?: AnyDepartmentCode[] }
) => {
  if (
    user.status === UserStatus.SOLI_BOT ||
    user.status === UserStatus.SIMPLE_USER // Translators doesn't have territories
  ) {
    return {
      areas: undefined,
      territories: [],
    };
  } else if (user.status === UserStatus.ADMIN_SOLIGUIDE) {
    return {
      areas: {
        ...user.areas,
        [userData.country]: new CountryAreaTerritories({
          departments: DEPARTMENT_CODES[userData.country],
        }),
      },
      territories: DEPARTMENT_CODES[userData.country],
    };
  } else if (user.status === UserStatus.PRO) {
    return {
      areas: user?.areas,
      territories: getTerritoriesFromAreas(user, userData.country),
    };
  } else {
    const territories = [
      ...new Set([
        ...(user.areas?.[userData.country]?.departments || []),
        ...(userData.territories || []),
      ]),
    ];

    return {
      areas: {
        ...user.areas,
        [userData.country]: new CountryAreaTerritories({
          departments: territories,
        }),
      },
      territories,
    };
  }
};
