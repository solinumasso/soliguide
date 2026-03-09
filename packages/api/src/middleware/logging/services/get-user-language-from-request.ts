import { ExpressRequest } from "../../../_models";
import { SUPPORTED_LANGUAGES, SupportedLanguagesCode } from "@soliguide/common";

export const getUserLanguageFromRequest = (
  req: ExpressRequest
): SupportedLanguagesCode => {
  const lang = req.params.lang;
  if (lang) {
    const cleanedLanguage = lang.trim().toLowerCase();
    if (
      SUPPORTED_LANGUAGES.includes(
        cleanedLanguage as unknown as SupportedLanguagesCode
      )
    ) {
      return cleanedLanguage as unknown as SupportedLanguagesCode;
    } else {
      throw new Error("Language not supported");
    }
  }
  return SupportedLanguagesCode.FR;
};
