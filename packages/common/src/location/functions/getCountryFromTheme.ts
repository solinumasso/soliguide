import { Themes } from "../../themes";
import { CountryCodes } from "../enums";

export const getCountryFromTheme = (theme: Themes): CountryCodes => {
  const countryCode = theme.split("_").pop();
  if (
    countryCode &&
    Object.values(CountryCodes).includes(countryCode as CountryCodes)
  ) {
    return countryCode as CountryCodes;
  }
  return CountryCodes.FR;
};
