import { isSupportedLanguage } from "@soliguide/common";

export const languagesValidator = {
  validator: (languages: unknown): boolean => {
    if (!languages || !Array.isArray(languages)) {
      return false;
    }
    return languages.every((language) => isSupportedLanguage(language));
  },
  message: "Path {PATH} is not a list of valid languages",
};
