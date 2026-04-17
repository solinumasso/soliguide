import {
  SoliguideCountries,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  SupportedLanguagesCode,
  TranslatedField,
  TranslatedFieldLanguageStatus,
  TranslatedFieldStatus,
} from "@soliguide/common";

import { logger } from "../../../general/logger";
import { CONFIG } from "../../../_models";

import { v2 } from "@google-cloud/translate";
import {
  findTranslatedField,
  updateManyTranslatedFields,
} from "../../../translations/services/translatedField.service";

import { getPlaceAndRebuildTranslation } from "../../../translations/controllers/translation.controller";
import isEmpty from "lodash.isempty";
import { FilterQuery } from "mongoose";
import { ApiTranslatedField } from "../../../translations/interfaces";
import { TranslatedFieldModel } from "../../../translations/models";

const GoogleTranslate = new v2.Translate({
  projectId: CONFIG.GOOGLE_PROJECT_ID,
  key: CONFIG.GOOGLE_API_KEY,
});

const translatedJobByCountry = async (country: SoliguideCountries) => {
  const matchQuery: Array<FilterQuery<TranslatedField>> = [];

  const sourceLanguage = SUPPORTED_LANGUAGES_BY_COUNTRY[country].source;
  const otherLanguages: SupportedLanguagesCode[] =
    SUPPORTED_LANGUAGES_BY_COUNTRY[country].otherLanguages;

  otherLanguages.forEach((language: SupportedLanguagesCode) => {
    matchQuery.push({
      [`languages.${language}.auto.content`]: { $not: { $regex: /\S/ } },
      sourceLanguage,
    });
  });

  // Group by content to process each unique text only once.
  const elements: ApiTranslatedField[] = await TranslatedFieldModel.aggregate([
    { $match: { $or: matchQuery } },
    { $group: { _id: "$content", doc: { $first: "$$ROOT" } } },
    { $replaceRoot: { newRoot: "$doc" } },
    { $limit: 100 },
  ]);

  const rebuiltPlaceIds = new Set<number>();

  for (const element of elements) {
    logger.info(
      `[TRANSLATION] [PLACE N*${element.lieu_id}] original content : ${element.content}`
    );

    let hasError = false;

    for (const lang of otherLanguages) {
      if (
        !element.languages[lang as SupportedLanguagesCode]?.auto ||
        !element.languages[lang as SupportedLanguagesCode]?.human
      ) {
        logger.error(
          `[TRANSLATEDFIELD CRON]: No human or auto elements for languages ${lang} for element ${element.elementName} of place ${element.lieu_id}`
        );
        hasError = true;
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
          logger.info(`[GOOGLE TRANSLATE] Translation in ${lang}`);

          const translation = await GoogleTranslate.translate(
            element.content,
            lang
          );

          if (!translation[0]?.trim()) {
            logger.error(
              `[GOOGLE TRANSLATE] Unexpected empty translation for lang=${lang} content="${element.content.slice(
                0,
                80
              )}" — will retry on next run`
            );
            hasError = true;
            continue;
          }

          newData = {
            [`languages.${lang}.auto.content`]: translation[0],
            [`languages.${lang}.auto.needHumanReview`]: true,
            [`languages.${lang}.auto.updatedAt`]: new Date(),
          };
        }

        // Update ALL documents sharing this content
        await updateManyTranslatedFields(
          {
            content: element.content,
          },
          newData
        );
      }
    }

    // Advance status from NEED_AUTO_TRANSLATE to NEED_HUMAN_TRANSLATE now that
    // all languages have been auto-translated. Only upgrade — never downgrade
    // documents already at NEED_HUMAN_TRANSLATE or TRANSLATION_COMPLETE.
    if (!hasError) {
      await updateManyTranslatedFields(
        {
          content: element.content,
          status: TranslatedFieldStatus.NEED_AUTO_TRANSLATE,
        },
        { status: TranslatedFieldStatus.NEED_HUMAN_TRANSLATE }
      );
    }

    // Collect all place IDs sharing this content, not just the representative
    // document's place, since updateManyTranslatedFields updated them all
    const affectedFields = await TranslatedFieldModel.find(
      { content: element.content },
      { lieu_id: 1 }
    ).lean();
    for (const field of affectedFields) {
      rebuiltPlaceIds.add(field.lieu_id);
    }
  }

  // Rebuild once per unique place rather than once per element
  for (const lieu_id of rebuiltPlaceIds) {
    await getPlaceAndRebuildTranslation(lieu_id);
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

  if (CONFIG.ENV !== "prod") {
    logger.warn(
      "[TRANSLATION] Skip translation in non-prod environment to avoid unnecessary costs and API calls."
    );
    return;
  }

  await Promise.all(
    Object.keys(SUPPORTED_LANGUAGES_BY_COUNTRY).map((countryCode) =>
      translatedJobByCountry(countryCode as SoliguideCountries)
    )
  );
}
