import {
  SoliguideCountries,
  SupportedLanguagesCode,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
} from "@soliguide/common";

export const getLangsForCountry = (
  country: SoliguideCountries
): SupportedLanguagesCode[] => {
  const conf = SUPPORTED_LANGUAGES_BY_COUNTRY[country];
  if (!conf) return [];
  const langs = [conf.source, ...(conf.otherLanguages || [])];
  return Array.from(new Set(langs));
};
