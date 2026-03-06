import { CountryCodes, slugString } from "@soliguide/common";
import { SPANISH_ABBREVIATIONS } from "../sources/ES";

export const cleanSearchValue = (
  country: CountryCodes,
  value: string
): string => {
  if (country === CountryCodes.FR) {
    // Source: https://github.com/BaseAdresseNationale/adresse.data.gouv.fr/blob/master/lib/api-adresse.js#L25
    if (
      value.slice(0, 1).toLowerCase() !== value.slice(0, 1).toUpperCase() ||
      (value.codePointAt(0) >= 48 && value.codePointAt(0) <= 57)
    ) {
      return slugString(value);
    }
    throw new Error("STRING_IS_NOT_VALID");
  } else {
    let cleanSearch = value.toLowerCase().trim();

    if ([CountryCodes.AD, CountryCodes.ES].includes(country)) {
      for (const [key, values] of Object.entries(SPANISH_ABBREVIATIONS)) {
        values.forEach((value) => {
          cleanSearch = cleanSearch.replace(value, key);
        });
      }
    }
    return cleanSearch;
  }
};
