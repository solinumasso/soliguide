import {
  CountryAreaTerritories,
  OperationalAreas,
  SoliguideCountries,
} from "@soliguide/common";
import get from "lodash.get";

function mergeArrays<T>(arr1: T[], arr2: T[]): T[] {
  return Array.from(new Set([...arr1, ...arr2]));
}

function mergeCountryAreaTerritories<CountryCode extends SoliguideCountries>(
  area1: CountryAreaTerritories<CountryCode>,
  area2: CountryAreaTerritories<CountryCode>
): CountryAreaTerritories<CountryCode> {
  return new CountryAreaTerritories<CountryCode>({
    departments: mergeArrays(area1.departments ?? [], area2.departments ?? []),
    regions: mergeArrays(area1.regions ?? [], area2.regions ?? []),
    cities: mergeArrays(area1.cities ?? [], area2.cities ?? []),
  });
}

export const mergeOperationalAreas = (
  areasToImport?: OperationalAreas,
  areasToUpdate?: OperationalAreas
): OperationalAreas | undefined => {
  if (!areasToImport) {
    if (areasToUpdate) {
      return areasToUpdate;
    }
    return undefined;
  }

  if (!areasToUpdate) {
    areasToUpdate = areasToImport;
  }

  let mergedAreas: OperationalAreas = { ...areasToUpdate };

  for (const key of Object.keys(areasToImport)) {
    const country = key as SoliguideCountries;
    const areasExists = get(areasToUpdate, country);
    if (areasExists) {
      const mergedCountryArea = mergeCountryAreaTerritories(
        areasExists,
        areasToImport[country] as CountryAreaTerritories<SoliguideCountries>
      );

      mergedAreas = { ...mergedAreas, [country]: mergedCountryArea };
    } else {
      mergedAreas = { ...mergedAreas, [country]: areasToImport[country] };
    }
  }

  return mergedAreas;
};
