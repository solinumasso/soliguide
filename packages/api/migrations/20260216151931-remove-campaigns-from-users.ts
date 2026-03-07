import { Db } from "mongodb";

import { logger } from "../src/general/logger";

const message = "Remove campaigns field from users";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const result = await db
    .collection("users")
    .updateMany(
      { campaigns: { $exists: true } },
      { $unset: { campaigns: "" } }
    );

  logger.info(
    `[MIGRATION] - Removed campaigns from ${result.modifiedCount} users`
  );
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);
  // Cannot restore campaigns data - this is a one-way migration
  await db.collection("users").findOne();
};
