/* eslint-disable @typescript-eslint/no-explicit-any */
import i18next, { i18n, use } from "i18next";

import Backend from "i18next-fs-backend";

import { join } from "path";
import { SUPPORTED_LANGUAGES } from "../constants";
import { SupportedLanguagesCode } from "../enums";

const options = {
  backend: {
    loadPath: join(__dirname, "../locales/{{lng}}.json"),
  },
  fallbackLng: SupportedLanguagesCode.FR,
  initImmediate: false,
  preload: SUPPORTED_LANGUAGES,
  supportedLngs: SUPPORTED_LANGUAGES,
};

use(Backend)
  .init(options, (err: any) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("i18next is ready...");
  })
  .catch((e: any) => {
    console.log(e);
  });

export const translator: i18n = i18next;
