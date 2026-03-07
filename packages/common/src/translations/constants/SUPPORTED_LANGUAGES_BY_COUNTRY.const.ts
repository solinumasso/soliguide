
import { SupportedLanguagesCode } from "../enums";
import { CountryCodes } from "../../location";
import { SupportedCountriesLanguages } from "..";

/**
 * !!! The country order is important !!!
 * The first country is the default country
 * The other countries are the other languages
 * The order is important because it reflects
 * the order of the languages in the UI
 */
export const SUPPORTED_LANGUAGES_BY_COUNTRY: SupportedCountriesLanguages = {
  [CountryCodes.FR]: {
    source: SupportedLanguagesCode.FR,
    otherLanguages: [
      SupportedLanguagesCode.AR,
      SupportedLanguagesCode.EN,
      SupportedLanguagesCode.ES,
      SupportedLanguagesCode.RU,
      SupportedLanguagesCode.PS,
      SupportedLanguagesCode.FA,
      SupportedLanguagesCode.UK,
      SupportedLanguagesCode.CA,
      SupportedLanguagesCode.KA,
      SupportedLanguagesCode.RO,
    ],
  },
  [CountryCodes.ES]: {
    source: SupportedLanguagesCode.CA,
    otherLanguages: [
      SupportedLanguagesCode.ES,
      SupportedLanguagesCode.FR,
      SupportedLanguagesCode.EN,
      SupportedLanguagesCode.AR,
      SupportedLanguagesCode.UK,
    ],
  },
  [CountryCodes.AD]: {
    source: SupportedLanguagesCode.CA,
    otherLanguages: [
      SupportedLanguagesCode.ES,
      SupportedLanguagesCode.FR,
      SupportedLanguagesCode.EN,
      SupportedLanguagesCode.AR,
      SupportedLanguagesCode.UK,
    ],
  },
};
