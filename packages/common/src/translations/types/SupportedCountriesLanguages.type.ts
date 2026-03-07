import { SoliguideCountries } from "../../location";
import { SupportedLanguagesCode } from "../enums";

export interface LanguageSupport {
  source: SupportedLanguagesCode;
  otherLanguages: SupportedLanguagesCode[];
}

export type SupportedCountriesLanguages = {
  [key in SoliguideCountries]: LanguageSupport;
};
