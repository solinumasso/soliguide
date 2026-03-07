import { Db } from "mongodb";

import { logger } from "../src/general/logger";

const message =
  "Remove airtable field (including lastSync) from emailsCampaign collection";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const collection = db.collection("emailsCampaign");

  // Count documents before migration
  const countBefore = await collection.countDocuments({
    airtable: { $exists: true },
  });
  logger.info(
    `[MIGRATION] - Found ${countBefore} documents with airtable field`
  );

  // Remove the airtable field from all documents
  const result = await collection.updateMany({}, { $unset: { airtable: "" } });

  logger.info(`[MIGRATION] - Updated ${result.modifiedCount} documents`);

  // Verify the migration
  const countAfter = await collection.countDocuments({
    airtable: { $exists: true },
  });
  logger.info(
    `[MIGRATION] - Remaining documents with airtable field: ${countAfter}`
  );
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  const collection = db.collection("emailsCampaign");

  // Add back the airtable field with default values
  const result = await collection.updateMany(
    { airtable: { $exists: false } },
    {
      $set: {
        airtable: {
          lastSync: null,
          recordId: null,
          synced: false,
        },
      },
    }
  );

  logger.info(
    `[ROLLBACK] - Restored airtable field in ${result.modifiedCount} documents`
  );
};
