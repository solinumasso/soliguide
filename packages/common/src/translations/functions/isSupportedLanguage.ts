import { SUPPORTED_LANGUAGES } from "../constants";
import { SupportedLanguagesCode } from "../enums";

export const isSupportedLanguage = (
  language: SupportedLanguagesCode | string
): language is SupportedLanguagesCode => {
  return SUPPORTED_LANGUAGES.includes(language as SupportedLanguagesCode);
};
