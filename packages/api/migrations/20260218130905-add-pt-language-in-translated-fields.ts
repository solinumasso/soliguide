import { Db } from "mongodb";

import { SupportedLanguagesCode } from "@soliguide/common";
import {
  ApiTranslatedFieldContent,
  ApiTranslatedPlaceContent,
} from "../src/translations/classes";
import { logger } from "../src/general/logger";

const newLang = SupportedLanguagesCode.PT;

const message = `Add ${newLang} in languages of translatedFields`;

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);
  const apiTranslatedFieldContent = new ApiTranslatedFieldContent();
  await db.collection("translatedFields").updateMany(
    {
      languages: { $exists: true },
      [`languages.${newLang}`]: { $exists: false },
    },
    {
      $set: {
        [`languages.${newLang}`]: apiTranslatedFieldContent,
      },
    }
  );

  const apiTranslatedPlaceContent = new ApiTranslatedPlaceContent();
  await db.collection("translatedPlaces").updateMany(
    {
      languages: { $exists: true },
      [`languages.${newLang}`]: { $exists: false },
    },
    { $set: { [`languages.${newLang}`]: apiTranslatedPlaceContent } }
  );
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  await db
    .collection("translatedFields")
    .updateMany(
      { [`languages.${newLang}`]: { $exists: true } },
      { $unset: { [`languages.${newLang}`]: "" } }
    );

  await db
    .collection("translatedPlaces")
    .updateMany(
      { [`languages.${newLang}`]: { $exists: true } },
      { $unset: { [`languages.${newLang}`]: "" } }
    );
};
