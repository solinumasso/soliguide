import { Db } from "mongodb";

import { logger } from "../../src/general/logger";

export const up = async (db: Db) => {
  logger.info("[MIGRATION] - Reset migration variable");
  await db.collection("lieux").updateMany(
    {},
    {
      $set: {
        migrated: false,
      },
    }
  );
};
