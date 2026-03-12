import { Db } from "mongodb";

import { logger } from "../src/general/logger";

const message =
  "Delete translatedFields and translatedPlaces for non-ONLINE places";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const nonOnlinePlaces = await db
    .collection("lieux")
    .find({ status: { $ne: "ONLINE" } }, { projection: { lieu_id: 1 } })
    .toArray();

  const lieu_ids = nonOnlinePlaces.map((p) => p.lieu_id);

  logger.info(
    `[MIGRATION] Found ${lieu_ids.length} non-ONLINE places, deleting their translation data...`
  );

  const deletedFields = await db
    .collection("translatedFields")
    .deleteMany({ lieu_id: { $in: lieu_ids } });

  const deletedPlaces = await db
    .collection("translatedPlaces")
    .deleteMany({ lieu_id: { $in: lieu_ids } });

  logger.info(
    `[MIGRATION] Deleted ${deletedFields.deletedCount} translatedFields and ${deletedPlaces.deletedCount} translatedPlaces`
  );
};

export const down = async (db: Db) => {
  logger.info(
    `[ROLLBACK] - ${message} — no rollback possible, data was orphaned`
  );
};
