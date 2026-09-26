import { Db } from "mongodb";

import { logger } from "../src/general/logger";

const message =
  "Set an empty registrations map on places and organizations missing it";

const COLLECTIONS = ["lieux", "organization"];

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  for (const collection of COLLECTIONS) {
    const result = await db
      .collection(collection)
      .updateMany(
        { registrations: { $exists: false } },
        { $set: { registrations: {} } }
      );

    logger.info(
      `[MIGRATION] - ${collection}: ${result.matchedCount} matched, ${result.modifiedCount} modified`
    );
  }
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  // Only remove empty maps: identifiers entered since then are kept
  for (const collection of COLLECTIONS) {
    const result = await db
      .collection(collection)
      .updateMany({ registrations: {} }, { $unset: { registrations: "" } });

    logger.info(
      `[ROLLBACK] - ${collection}: ${result.matchedCount} matched, ${result.modifiedCount} modified`
    );
  }
};
