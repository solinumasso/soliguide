import { Db } from "mongodb";

import { logger } from "../src/general/logger";

const message = "Migration purpose";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);
  await db.collection("lieux").findOne();
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);
  await db.collection("lieux").findOne();
};
