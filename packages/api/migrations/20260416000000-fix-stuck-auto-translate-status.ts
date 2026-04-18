import { Db } from "mongodb";

import { SUPPORTED_LANGUAGES_BY_COUNTRY } from "@soliguide/common";

import { logger } from "../src/general/logger";

const message =
  "Advance stuck NEED_AUTO_TRANSLATE documents whose configured languages are all already translated";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const collection = db.collection("translatedFields");

  await collection.createIndex({ content: 1, status: 1 });

  let advancedCount = 0;

  for (const [
    country,
    { source: sourceLanguage, otherLanguages },
  ] of Object.entries(SUPPORTED_LANGUAGES_BY_COUNTRY)) {
    const allTranslatedFilter: Record<string, unknown> = {
      status: "NEED_AUTO_TRANSLATE",
      sourceLanguage,
    };

    for (const lang of otherLanguages) {
      allTranslatedFilter[`languages.${lang}.auto.content`] = {
        $nin: [null, ""],
      };
    }

    const result = await collection.updateMany(allTranslatedFilter, {
      $set: { status: "NEED_HUMAN_TRANSLATE" },
    });

    advancedCount += result.modifiedCount;

    logger.info(
      `[MIGRATION] [${country}] Advanced ${result.modifiedCount} stuck NEED_AUTO_TRANSLATE documents`
    );
  }

  logger.info(`[MIGRATION] Total advanced: ${advancedCount} documents`);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const down = (_db: Db) => {
  logger.info(
    `[ROLLBACK] - ${message} — no rollback possible, status cannot be reverted`
  );
};
