import { SoliguideCountries } from "../../location";
import { SUPPORTED_LANGUAGES_BY_COUNTRY } from "../constants/SUPPORTED_LANGUAGES_BY_COUNTRY.const";
import { SupportedLanguagesCode } from "../enums";

/**
 * The languages a country's interface is available in, source language first.
 *
 * The order is meaningful: it drives the order the languages are offered in,
 * and the first entry is the country's default language.
 */
export const getSupportedLanguagesByCountry = (
  country: SoliguideCountries
): SupportedLanguagesCode[] => {
  const countryLanguages = SUPPORTED_LANGUAGES_BY_COUNTRY[country];

  if (!countryLanguages) {
    return [];
  }

  return Array.from(
    new Set([
      countryLanguages.source,
      ...(countryLanguages.otherLanguages ?? []),
    ])
  );
};
