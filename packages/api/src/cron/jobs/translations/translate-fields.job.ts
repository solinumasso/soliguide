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
import {
  SoliguideCountries,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  SupportedLanguagesCode,
  TranslatedField,
  TranslatedFieldLanguageStatus,
} from "@soliguide/common";

import { logger } from "../../../general/logger";
import { CONFIG } from "../../../_models";

import { v2 } from "@google-cloud/translate";
import {
  findTranslatedField,
  findTranslatedFields,
  updateManyTranslatedFields,
} from "../../../translations/services/translatedField.service";

import { getPlaceAndRebuildTranslation } from "../../../translations/controllers/translation.controller";
import isEmpty from "lodash.isempty";
import { FilterQuery } from "mongoose";
import { ApiTranslatedField } from "../../../translations/interfaces";

const GoogleTranslate = new v2.Translate({
  projectId: CONFIG.GOOGLE_PROJECT_ID,
  key: CONFIG.GOOGLE_API_KEY,
});

const translatedJobByCountry = async (country: SoliguideCountries) => {
  const query: Array<FilterQuery<TranslatedField>> = [];

  const sourceLanguage = SUPPORTED_LANGUAGES_BY_COUNTRY[country].source;
  const otherLanguages: SupportedLanguagesCode[] =
    SUPPORTED_LANGUAGES_BY_COUNTRY[country].otherLanguages;

  otherLanguages.forEach((language: SupportedLanguagesCode) => {
    query.push({
      [`languages.${language}.auto.content`]: { $in: [null, ""] },
      sourceLanguage,
    });
  });

  const elements = await findTranslatedFields(
    {
      $or: query,
    },
    {
      limit: 10,
      page: 1,
      skip: 0,
      sort: { lieu_id: "ascending" },
    }
  );

  for (const element of elements) {
    logger.info(
      `[TRANSLATION] [PLACE N*${element.lieu_id}] original content : ${element.content}`
    );

    for (const lang of otherLanguages) {
      if (
        !element.languages[lang as SupportedLanguagesCode]?.auto ||
        !element.languages[lang as SupportedLanguagesCode]?.human
      ) {
        logger.error(
          `[TRANSLATEDFIELD CRON]: No human or auto elements for languages ${lang} for element ${element.elementName} of place ${element.lieu_id}`
        );
        continue;
      }
      const sourceContent =
        element.languages[lang as SupportedLanguagesCode]!.auto.content;

      if (isEmpty(sourceContent)) {
        // Search for existing human translation
        const humanTranslation = await findTranslatedField({
          [`languages.${lang as SupportedLanguagesCode}.human.status`]:
            TranslatedFieldLanguageStatus.ONLINE,
          content: element.content,
        });

        let newData: Partial<ApiTranslatedField> = {};
        if (humanTranslation) {
          logger.info(
            "We reuse the translations already verified by a translator"
          );

          const translatedContent =
            humanTranslation.languages[lang as SupportedLanguagesCode]!.human;

          newData = {
            [`languages.${lang}.auto.content`]: translatedContent.content,
            [`languages.${lang}.auto.needHumanReview`]: false,
            [`languages.${lang}.auto.updatedAt`]: new Date(),
            [`languages.${lang}.human.content`]: translatedContent.content,
            [`languages.${lang}.human.status`]:
              TranslatedFieldLanguageStatus.ONLINE,
            [`languages.${lang}.human.translatorName`]:
              translatedContent?.translatorName,
            [`languages.${lang}.human.updatedAt`]: new Date(),
          };
        } else {
          // check if content exist with human translate
          logger.info(`[GOOGLE TRANSLATE] Translation in ${lang}`);

          const translation = await GoogleTranslate.translate(
            element.content,
            lang
          );

          newData = {
            [`languages.${lang}.auto.content`]: translation[0],
            [`languages.${lang}.auto.needHumanReview`]: true,
            [`languages.${lang}.auto.updatedAt`]: new Date(),
          };
        }

        // Update the translation
        await updateManyTranslatedFields(
          {
            content: element.content,
          },
          newData
        );
      }
    }

    // The place is put back for translation
    await getPlaceAndRebuildTranslation(element.lieu_id);
  }

  if (!elements.length) {
    logger.warn("[TRANSLATION] Nothing to translate");
  }
};

/**
 * @summary Update a translation
 */
export async function translateFieldsJob(): Promise<void> {
  if (!CONFIG.GOOGLE_API_KEY || !CONFIG.GOOGLE_PROJECT_ID) {
    logger.warn(
      "[TRANSLATION] Google credentials not provided, not translating."
    );
    return;
  }

  await Promise.all(
    Object.keys(SUPPORTED_LANGUAGES_BY_COUNTRY).map((countryCode) =>
      translatedJobByCountry(countryCode as SoliguideCountries)
    )
  );
}
