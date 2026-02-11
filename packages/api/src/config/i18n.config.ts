/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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
