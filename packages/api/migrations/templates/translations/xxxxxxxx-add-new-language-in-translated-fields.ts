import { Db } from "mongodb";

import {
  CountryCodes,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  SupportedLanguagesCode,
} from "@soliguide/common";

import { logger } from "../../../src/general/logger";
import {
  ApiTranslatedFieldContent,
  ApiTranslatedPlaceContent,
} from "../../../src/translations/classes";

// TODO: set the target language and country before running
const newLang = SupportedLanguagesCode.AR;
const country = CountryCodes.FR;

const { source: sourceLanguage, otherLanguages } =
  SUPPORTED_LANGUAGES_BY_COUNTRY[country];

if (!otherLanguages.includes(newLang)) {
  throw new Error(
    `[MIGRATION] ${newLang} is not configured for ${country} — aborting`
  );
}

const message = `Add ${newLang} in languages of translatedFields for ${country}`;

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const fieldCol = db.collection("translatedFields");
  const placeCol = db.collection("translatedPlaces");

  const fieldFilter = {
    sourceLanguage,
    languages: { $exists: true },
    [`languages.${newLang}`]: { $exists: false },
  };
  const placeFilter = {
    sourceLanguage,
    languages: { $exists: true },
    [`languages.${newLang}`]: { $exists: false },
  };

  // Before
  const beforeFields = await fieldCol.countDocuments(fieldFilter);
  const beforePlaces = await placeCol.countDocuments(placeFilter);
  logger.info(
    `[MIGRATION] Before: ${beforeFields} translatedFields, ${beforePlaces} translatedPlaces to update`
  );

  await fieldCol.updateMany(fieldFilter, {
    $set: { [`languages.${newLang}`]: new ApiTranslatedFieldContent() },
  });
  await placeCol.updateMany(placeFilter, {
    $set: { [`languages.${newLang}`]: new ApiTranslatedPlaceContent() },
  });

  // After
  const afterFields = await fieldCol.countDocuments(fieldFilter);
  const afterPlaces = await placeCol.countDocuments(placeFilter);
  logger.info(
    `[MIGRATION] After: ${afterFields} translatedFields, ${afterPlaces} translatedPlaces still missing ${newLang}`
  );

  // Sanity check: countries that should NOT have this language must still have 0 docs with it
  const forbiddenSourceLanguages = [
    ...new Set(
      Object.entries(SUPPORTED_LANGUAGES_BY_COUNTRY)
        .filter(([, config]) => !config.otherLanguages.includes(newLang))
        .map(([, config]) => config.source)
    ),
  ];

  if (forbiddenSourceLanguages.length > 0) {
    const wrongFields = await fieldCol.countDocuments({
      sourceLanguage: { $in: forbiddenSourceLanguages },
      [`languages.${newLang}`]: { $exists: true },
    });
    const wrongPlaces = await placeCol.countDocuments({
      sourceLanguage: { $in: forbiddenSourceLanguages },
      [`languages.${newLang}`]: { $exists: true },
    });

    if (wrongFields > 0 || wrongPlaces > 0) {
      throw new Error(
        `[MIGRATION] ERROR: ${wrongFields} translatedFields and ${wrongPlaces} translatedPlaces ` +
          `from forbidden countries have ${newLang} — investigate immediately`
      );
    }

    logger.info(
      `[MIGRATION] Sanity check passed: no forbidden-country documents have ${newLang}`
    );
  }
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  await db
    .collection("translatedFields")
    .updateMany(
      { sourceLanguage, [`languages.${newLang}`]: { $exists: true } },
      { $unset: { [`languages.${newLang}`]: "" } }
    );

  await db
    .collection("translatedPlaces")
    .updateMany(
      { sourceLanguage, [`languages.${newLang}`]: { $exists: true } },
      { $unset: { [`languages.${newLang}`]: "" } }
    );
};
