
import { DEPARTMENTS_MAP, FR_EXCEPTIONAL_POSTAL_CODES } from "../constants";
import { CountryCodes, SoliguideCountries } from "../enums";
import { AnyDepartmentCode, DepartmentCode } from "../types";

export const getPostalCodeForAndorra = (
  postalCode: string
): AnyDepartmentCode => {
  const POSTAL_CODES_DEPARTMENT_CODES: Record<
    string,
    DepartmentCode<CountryCodes.AD>
  > = {
    AD100: "02",
    AD200: "03",
    AD300: "05",
    AD400: "04",
    AD500: "07",
    AD600: "06",
    AD700: "08",
  };

  if (typeof POSTAL_CODES_DEPARTMENT_CODES[postalCode] === "undefined") {
    throw new Error(
      `Department code ${postalCode} is not a known Andorra department code`
    );
  }

  return POSTAL_CODES_DEPARTMENT_CODES[postalCode] as AnyDepartmentCode;
};

export const getDepartmentCodeFromPostalCode = (
  country: SoliguideCountries,
  postalCodeOrCityCode: string
): AnyDepartmentCode => {
  if (!country || !postalCodeOrCityCode || postalCodeOrCityCode?.length < 3) {
    throw new Error("Code not set");
  }

  if (postalCodeOrCityCode.length === 4) {
    postalCodeOrCityCode = postalCodeOrCityCode.padStart(5, "0");
  }

  if (postalCodeOrCityCode.length !== 5) {
    const errorMessage = `Invalid city code ${postalCodeOrCityCode} for ${country} (cause: ${postalCodeOrCityCode.length} characters)`;
    throw new Error(errorMessage);
  }

  if (country === CountryCodes.FR) {
    const exceptionalPostalCode =
      FR_EXCEPTIONAL_POSTAL_CODES[postalCodeOrCityCode];
    if (exceptionalPostalCode?.departmentCode) {
      // Some cities don't have a postal code matching a department name
      return exceptionalPostalCode?.departmentCode;
    }

    if (postalCodeOrCityCode.startsWith("20")) {
      // Corsica https://fr.wikipedia.org/wiki/Code_postal_en_France#Corse_(20)
      if (
        postalCodeOrCityCode.startsWith("200") ||
        postalCodeOrCityCode.startsWith("201")
      ) {
        // South Corsica
        return "2A";
      }

      if (
        postalCodeOrCityCode.startsWith("202") ||
        postalCodeOrCityCode.startsWith("206")
      ) {
        // North Corsica
        return "2B";
      }

      const errorMessage = `Invalid postal code ${postalCodeOrCityCode} for Corsica in France`;
      throw new Error(errorMessage);
    }

    // Overseas: https://fr.wikipedia.org/wiki/Code_postal_en_France#France_d'outre-mer
    if (
      postalCodeOrCityCode.startsWith("97") ||
      postalCodeOrCityCode.startsWith("98")
    ) {
      // Note: Saint-Barthélemy and Saint-Martin exceptions are handled using FR_EXCEPTIONAL_POSTAL_CODES constant above
      return postalCodeOrCityCode
        .substring(0, 3)
        .toUpperCase() as DepartmentCode<CountryCodes.FR>;
    }
  } else if (country === CountryCodes.AD) {
    return getPostalCodeForAndorra(postalCodeOrCityCode);
  }

  // General case
  const departmentCode = postalCodeOrCityCode.substring(
    0,
    2
  ) as AnyDepartmentCode;

  if (!(departmentCode in DEPARTMENTS_MAP[country])) {
    throw new Error(
      `Department code ${departmentCode} is not a known Spanish department code`
    );
  }

  return departmentCode;
};
