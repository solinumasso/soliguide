import { Db } from "mongodb";

import { logger } from "../src/general/logger";

const message =
  "Drop search_suggestions collection (data moved to static JSON files in @soliguide/common)";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const collections = await db
    .listCollections({ name: "search_suggestions" })
    .toArray();

  if (collections.length > 0) {
    await db.dropCollection("search_suggestions");
    logger.info("[MIGRATION] - Collection search_suggestions dropped");
  } else {
    logger.info(
      "[MIGRATION] - Collection search_suggestions does not exist, skipping"
    );
  }
};

export const down = async () => {
  logger.info(`[ROLLBACK] - ${message}`);
  logger.info(
    "[ROLLBACK] - Collection search_suggestions cannot be restored. Re-run sync-categories script to repopulate."
  );
};
