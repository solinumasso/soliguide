import { RootQuerySelector } from "mongoose";
import {
  ApiPlace,
  CommonUser,
  CountryCodes,
  getAllowedTerritories,
  SoliguideCountries,
} from "@soliguide/common";
import { UserPopulateType } from "../../../_models";

const createPositionRequestForCountry = (
  user: Pick<CommonUser, "areas" | "status">,
  country: SoliguideCountries
) => {
  const allowedTerritories = getAllowedTerritories(user, country);

  return {
    $or: [
      {
        "position.departmentCode": { $in: allowedTerritories },
        "position.country": country,
      },
      {
        "parcours.position.departmentCode": { $in: allowedTerritories },
        "parcours.position.country": country,
      },
    ],
  };
};

export const generateApiUserRestriction = (
  nosqlQuery: RootQuerySelector<ApiPlace>,
  user: UserPopulateType
): RootQuerySelector<ApiPlace> => {
  const apiUserRestriction: RootQuerySelector<ApiPlace> = {};

  const userAreasCountries = Object.keys(user.areas ?? {});

  // One country only
  if (userAreasCountries.length === 1) {
    const country = userAreasCountries[0] as SoliguideCountries;
    const conditions = createPositionRequestForCountry(user, country);
    Object.assign(apiUserRestriction, conditions);
  }
  // Multiple countries
  else if (userAreasCountries.length > 1) {
    const countriesOr = userAreasCountries.map((country) =>
      createPositionRequestForCountry(user, country as SoliguideCountries)
    );
    apiUserRestriction.$or = countriesOr;
  }
  // Default: no country set, we use France
  else {
    const conditions = createPositionRequestForCountry(user, CountryCodes.FR);
    Object.assign(apiUserRestriction, conditions);
  }

  return { $and: [apiUserRestriction, nosqlQuery] };
};
