import { CommonPlacePosition } from "../../place";
import { ALL_REGIONS_DEF } from "../constants";
import { CountryCodes, SoliguideCountries } from "../enums";
import { LocationAutoCompleteAddress, RegionDef } from "../interfaces";
import { AnyTimeZone } from "../types";

const getCountry = (country: string): SoliguideCountries => {
  country = country?.trim().substring(0, 2).toLowerCase();

  if (!Object.values(CountryCodes).includes(country as SoliguideCountries)) {
    throw new Error("COUNTRY_NOT_SUPPORTED");
  }
  return country as SoliguideCountries;
};

export const getTimeZoneFromPosition = (
  position: CommonPlacePosition | LocationAutoCompleteAddress
): AnyTimeZone => {
  if (!position?.country) {
    throw new Error("COUNTRY_IS_EMPTY");
  }

  const country = getCountry(position.country);

  let region: RegionDef<SoliguideCountries> | undefined;
  if (position?.regionCode) {
    region = ALL_REGIONS_DEF[country].find(
      (regionDef: RegionDef<typeof country>) =>
        regionDef.regionCode === position?.regionCode
    );
  }

  if (!region) {
    region = ALL_REGIONS_DEF[country].find((regionDef) =>
      regionDef.departments.some(
        (department) => department.departmentCode === position?.departmentCode
      )
    );
  }

  if (region?.timeZone) {
    return region.timeZone;
  }

  // Fix for "Monaco"
  if (
    country === CountryCodes.FR &&
    (position?.departmentCode as string) === "98" // 98 does not exists in Departments, we need to add "as string"
  ) {
    return "Europe/Paris";
  }

  throw new Error(`COUNTRY_NOT_SUPPORTED (${country})`);
};
