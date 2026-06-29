import { Db } from "mongodb";

import { PlaceType } from "@soliguide/common";

import { logger } from "../src/general/logger";

const message = "Set root position from first itinerary point";
const placesCollection = "lieux";

const itineraryFilter = {
  placeType: PlaceType.ITINERARY,
};

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const matchingCount = await db
    .collection(placesCollection)
    .countDocuments(itineraryFilter);

  logger.info(`[MIGRATION] - ${matchingCount} itinerary places found`);

  if (matchingCount === 0) {
    logger.info("[MIGRATION] - nothing to do, exiting");
    return;
  }

  const result = await db
    .collection(placesCollection)
    .updateMany(itineraryFilter, [
      {
        $set: {
          position: {
            $ifNull: [{ $arrayElemAt: ["$parcours.position", 0] }, null],
          },
        },
      },
    ]);

  logger.info(
    `[MIGRATION] - done: ${result.matchedCount} matched, ${result.modifiedCount} modified`
  );
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  const matchingCount = await db.collection(placesCollection).countDocuments({
    placeType: PlaceType.ITINERARY,
    position: { $ne: null },
  });

  logger.info(
    `[ROLLBACK] - ${matchingCount} itinerary places found with a root position`
  );

  if (matchingCount === 0) {
    logger.info("[ROLLBACK] - nothing to do, exiting");
    return;
  }

  const result = await db.collection(placesCollection).updateMany(
    {
      placeType: PlaceType.ITINERARY,
      position: { $ne: null },
    },
    {
      $set: { position: null },
    }
  );

  logger.info(
    `[ROLLBACK] - done: ${result.matchedCount} matched, ${result.modifiedCount} modified`
  );
};
