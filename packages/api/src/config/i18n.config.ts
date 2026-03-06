import { SUPPORTED_LANGUAGES, DEFAULT_LANG } from "@soliguide/common";

import type { i18n } from "i18next";
import i18next from "i18next";
import Backend from "i18next-fs-backend";

import { logger } from "../general/logger";
import { CONFIG } from "../_models";
import { join } from "node:path";

const options = {
  backend: {
    loadPath: join(__dirname, "../../resources/locales/{{lng}}.json"),
  },
  fallbackLng: DEFAULT_LANG,
  initImmediate: false,
  preload: SUPPORTED_LANGUAGES,
  supportedLngs: SUPPORTED_LANGUAGES,
};

i18next
  .use(Backend)
  .init(options, (err) => {
    if (err) {
      logger.error(err);
      return;
    }
    // Ne log que si pas en mode test
    if (CONFIG.ENV !== "test") {
      logger.info("i18next is ready...");
    }
  })
  .catch((err) => {
    logger.error(err);
  });

export const translator: i18n = i18next;
