import { SupportedLanguagesCode } from "@soliguide/common";
import { ApiTranslatedFieldContent } from "../classes";

export const getTranslatedFieldLanguagesByPlaceLanguages = (
  languages: SupportedLanguagesCode[]
) => {
  return languages.reduce((acc, lang: SupportedLanguagesCode) => {
    acc[lang] = new ApiTranslatedFieldContent();
    return acc;
  }, {} as Partial<Record<SupportedLanguagesCode, ApiTranslatedFieldContent>>);
};
