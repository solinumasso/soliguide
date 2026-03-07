
import { ApiPlace, getPosition } from "../../place";
import { SoliguideCountries } from "../enums";
import { AnyDepartmentCode } from "../types";

export const getTerritoryAndCountryFromPlace = (
  updatedPlace: Pick<ApiPlace, "placeType" | "position" | "parcours">
): {
  country?: SoliguideCountries;
  territory?: AnyDepartmentCode;
} => {
  const position = getPosition(updatedPlace);
  if (position) {
    return {
      territory: position.departmentCode,
      country: position?.country?.toLowerCase() as SoliguideCountries,
    };
  }
  return {};
};
