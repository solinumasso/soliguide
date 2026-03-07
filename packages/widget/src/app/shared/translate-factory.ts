import { TranslateService } from "@ngx-translate/core";

import { BOTS_LIST } from "./constants";

import { SUPPORTED_LANGUAGES, SupportedLanguagesCode } from "@soliguide/common";

export const translateFactory = (
  translateService: TranslateService
): unknown => {
  return async () => {
    const languages = SUPPORTED_LANGUAGES;

    let selectedLanguage =
      languages.indexOf(
        navigator.language.substring(0, 2) as SupportedLanguagesCode
      ) !== -1
        ? navigator.language.substring(0, 2)
        : SupportedLanguagesCode.FR;

    const robots = new RegExp(BOTS_LIST.join("|"), "i");

    if (robots.test(window.navigator.userAgent)) {
      selectedLanguage = SupportedLanguagesCode.FR;
    }

    translateService.setDefaultLang(selectedLanguage);
    translateService.use(selectedLanguage);

    return new Promise<void>((resolve) => {
      translateService.onLangChange.subscribe(() => {
        resolve();
      });
    });
  };
};
