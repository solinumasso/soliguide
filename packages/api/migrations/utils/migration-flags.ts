import { Db } from "mongodb";

import { logger } from "../../src/general/logger";

export const resetMigrationFlag = async (
  db: Db,
  collection: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any
): Promise<void> => {
  logger.info("[MIGRATION] - Reset migration variable");
  await db.collection(collection).updateMany(query, {
    $set: {
      migrated: false,
    },
  });
};

export const countElementsToMigrate = async (
  db: Db,
  collection: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any
): Promise<number> => {
  return await db.collection(collection).countDocuments(query);
};
