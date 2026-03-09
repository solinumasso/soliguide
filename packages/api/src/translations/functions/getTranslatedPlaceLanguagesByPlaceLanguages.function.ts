import { SupportedLanguagesCode } from "@soliguide/common";

import { ApiTranslatedPlaceContent } from "../classes/ApiTranslatedPlaceContent.class";

export const getTranslatedPlaceLanguagesByPlaceLanguages = (
  languages: unknown
): Map<SupportedLanguagesCode, ApiTranslatedPlaceContent> => {
  if (!Array.isArray(languages) || languages.length === 0) {
    throw new Error("LANGUAGES_IS_NOT_AN_ARRAY");
  }

  return languages.reduce((map, lang) => {
    if (typeof lang !== "string") {
      throw new Error(`Code de langue invalide: ${lang}`);
    }
    map.set(lang, new ApiTranslatedPlaceContent());
    return map;
  }, new Map<SupportedLanguagesCode, ApiTranslatedPlaceContent>());
};
