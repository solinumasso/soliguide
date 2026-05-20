import { subMonths, startOfDay } from "date-fns";
import { Db } from "mongodb";

import { logger } from "../src/general/logger";

const message =
  "Set ONLINE places that were set OFFLINE in the last month (updatedByUserAt between 6 and 7 months ago)";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  // The set-offline cron targets places where updatedByUserAt < 6 months ago.
  // Places whose updatedByUserAt falls between 6 and 7 months ago would have
  // been set OFFLINE during the last month (when the cron last ran on them).
  const sixMonthsAgo = startOfDay(subMonths(new Date(), 6));
  const sevenMonthsAgo = startOfDay(subMonths(new Date(), 7));

  logger.info(
    `[MIGRATION] - date range: updatedByUserAt >= ${sevenMonthsAgo.toISOString()} and < ${sixMonthsAgo.toISOString()}`
  );

  const matchingCount = await db.collection("lieux").countDocuments({
    status: "OFFLINE",
    updatedByUserAt: { $gte: sevenMonthsAgo, $lt: sixMonthsAgo },
  });

  logger.info(
    `[MIGRATION] - ${matchingCount} places found to set back to ONLINE`
  );

  if (matchingCount === 0) {
    logger.info("[MIGRATION] - nothing to do, exiting");
    return;
  }

  const result = await db.collection("lieux").updateMany(
    {
      status: "OFFLINE",
      updatedByUserAt: { $gte: sevenMonthsAgo, $lt: sixMonthsAgo },
    },
    {
      $set: { status: "ONLINE" },
    }
  );

  logger.info(
    `[MIGRATION] - done: ${result.matchedCount} matched, ${result.modifiedCount} modified`
  );
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  const sixMonthsAgo = startOfDay(subMonths(new Date(), 6));
  const sevenMonthsAgo = startOfDay(subMonths(new Date(), 7));

  logger.info(
    `[ROLLBACK] - date range: updatedByUserAt >= ${sevenMonthsAgo.toISOString()} and < ${sixMonthsAgo.toISOString()}`
  );

  const matchingCount = await db.collection("lieux").countDocuments({
    status: "ONLINE",
    updatedByUserAt: { $gte: sevenMonthsAgo, $lt: sixMonthsAgo },
  });

  logger.info(
    `[ROLLBACK] - ${matchingCount} places found to set back to OFFLINE`
  );

  if (matchingCount === 0) {
    logger.info("[ROLLBACK] - nothing to do, exiting");
    return;
  }

  const result = await db.collection("lieux").updateMany(
    {
      status: "ONLINE",
      updatedByUserAt: { $gte: sevenMonthsAgo, $lt: sixMonthsAgo },
    },
    {
      $set: { status: "OFFLINE" },
    }
  );

  logger.info(
    `[ROLLBACK] - done: ${result.matchedCount} matched, ${result.modifiedCount} modified`
  );
};
