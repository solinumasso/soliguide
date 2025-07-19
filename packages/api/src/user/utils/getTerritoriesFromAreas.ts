import {
  OperationalAreas,
  SoliguideCountries,
  AnyDepartmentCode,
  SOLIGUIDE_COUNTRIES,
} from "@soliguide/common";

export const extractTerritoriesAndCountryFromAreas = (
  areas?: OperationalAreas
): { territories: AnyDepartmentCode[]; country?: SoliguideCountries } => {
  if (!areas) {
    return { territories: [] };
  }

  for (const country of SOLIGUIDE_COUNTRIES) {
    const countryAreas = areas[country];
    if (countryAreas?.departments && countryAreas.departments.length > 0) {
      return {
        territories: countryAreas.departments,
        country: country,
      };
    }
  }

  return { territories: [] };
};

export const extractTerritoriesFromAreasForCountry = (
  areas: OperationalAreas | undefined,
  country: SoliguideCountries
): AnyDepartmentCode[] => {
  if (!areas || !areas[country]) {
    return [];
  }

  const countryAreas = areas[country];
  return countryAreas?.departments || [];
};
