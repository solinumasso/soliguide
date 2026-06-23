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

const TRANSLATION_BATCH_LIMIT = 100;
const GOOGLE_TRANSLATE_MAX_ATTEMPTS = 3;
const GOOGLE_TRANSLATE_RETRY_DELAY_MS = 1000;

const RETRYABLE_GOOGLE_TRANSLATE_ERROR_CODES = new Set([
  "ECONNRESET",
  "ETIMEDOUT",
  "EAI_AGAIN",
  "ENOTFOUND",
  "ERR_STREAM_PREMATURE_CLOSE",
]);

type GoogleTranslateClient = Pick<v2.Translate, "translate">;

const wait = async (durationMs: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, durationMs));
};

export const isRetryableGoogleTranslateError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const googleError = error as {
    code?: number | string;
    errno?: string;
    status?: number;
    statusCode?: number;
  };

  const errorCode =
    typeof googleError.code === "string" ? googleError.code : googleError.errno;
  const statusCode =
    googleError.statusCode ??
    googleError.status ??
    (typeof googleError.code === "number" ? googleError.code : undefined);

  return Boolean(
    (errorCode && RETRYABLE_GOOGLE_TRANSLATE_ERROR_CODES.has(errorCode)) ||
      (statusCode && (statusCode === 429 || statusCode >= 500))
  );
};

export const translateTextWithRetry = async (
  translateClient: GoogleTranslateClient,
  content: string,
  lang: SupportedLanguagesCode,
  retryDelayMs = GOOGLE_TRANSLATE_RETRY_DELAY_MS
): Promise<string> => {
  for (let attempt = 1; attempt <= GOOGLE_TRANSLATE_MAX_ATTEMPTS; attempt++) {
    try {
      const [translation] = await translateClient.translate(content, lang);

      return Array.isArray(translation) ? translation[0] ?? "" : translation;
    } catch (error) {
      const shouldRetry =
        attempt < GOOGLE_TRANSLATE_MAX_ATTEMPTS &&
        isRetryableGoogleTranslateError(error);

      if (!shouldRetry) {
        throw error;
      }

      logger.warn(
        { err: error, attempt, lang },
        "[GOOGLE TRANSLATE] Retry after transient translation error"
      );

      await wait(retryDelayMs);
    }
  }

  throw new Error("[GOOGLE TRANSLATE] Translation failed after retries");
};

const translatedJobByCountry = async (country: SoliguideCountries) => {
  const matchQuery: Array<FilterQuery<TranslatedField>> = [];

  const sourceLanguage = SUPPORTED_LANGUAGES_BY_COUNTRY[country].source;
  const otherLanguages: SupportedLanguagesCode[] =
    SUPPORTED_LANGUAGES_BY_COUNTRY[country].otherLanguages;

  otherLanguages.forEach((language: SupportedLanguagesCode) => {
    matchQuery.push({
      [`languages.${language}.auto.content`]: { $in: [null, ""] },
      sourceLanguage,
    });
  });

  // Group by content to process each unique text only once
  const elements: ApiTranslatedField[] = await TranslatedFieldModel.aggregate([
    { $match: { $or: matchQuery } },
    { $group: { _id: "$content", doc: { $first: "$$ROOT" } } },
    { $replaceRoot: { newRoot: "$doc" } },
    { $limit: TRANSLATION_BATCH_LIMIT },
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
      const existingAutoContent =
        element.languages[lang as SupportedLanguagesCode]!.auto.content;

      if (isEmpty(existingAutoContent)) {
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

          try {
            const translatedContent = await translateTextWithRetry(
              GoogleTranslate,
              element.content,
              lang
            );

            newData = {
              [`languages.${lang}.auto.content`]: translatedContent,
              [`languages.${lang}.auto.needHumanReview`]: true,
              [`languages.${lang}.auto.updatedAt`]: new Date(),
            };
          } catch (error) {
            hasError = true;

            logger.error(
              {
                err: error,
                elementName: element.elementName,
                lang,
                lieu_id: element.lieu_id,
              },
              "[GOOGLE TRANSLATE] Failed to translate field"
            );
            continue;
          }
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
