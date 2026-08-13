import { RTL_LANGUAGES } from "../constants/RTL_LANGUAGES.const";
import { SupportedLanguagesCode } from "../enums";

/**
 * Whether a language is written from right to left. Accepts a plain string so
 * that callers can pass an unvalidated route parameter or storage value.
 */
export const isRightToLeftLanguage = (
  lang: SupportedLanguagesCode | string
): boolean => RTL_LANGUAGES.includes(lang as SupportedLanguagesCode);
