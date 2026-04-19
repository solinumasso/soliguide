import { AnyBulkWriteOperation, Db, Document } from "mongodb";

import { logger } from "../src/general/logger";

const message =
  "Fix translation duplicates: propagate best translations to NEED_AUTO_TRANSLATE records sharing the same content";

const BATCH_SIZE = 500;

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const collection = db.collection("translatedFields");

  // Index makes each per-content updateMany an index scan instead of a full collection scan
  await collection.createIndex({ content: 1, status: 1 });

  // One aggregation pass over already-translated records to find the best translation per content.
  // Sorting descending: TRANSLATION_COMPLETE (T…) takes priority over NEED_HUMAN_TRANSLATE (N…H…)
  const cursor = collection.aggregate<{
    _id: string;
    languages: Document;
    status: string;
  }>(
    [
      {
        $match: {
          status: { $in: ["NEED_HUMAN_TRANSLATE", "TRANSLATION_COMPLETE"] },
        },
      },
      { $sort: { status: -1 } },
      {
        $group: {
          _id: "$content",
          languages: { $first: "$languages" },
          status: { $first: "$status" },
        },
      },
    ],
    { allowDiskUse: true }
  );

  let updatedCount = 0;
  let batch: AnyBulkWriteOperation[] = [];

  for await (const { _id: content, languages, status } of cursor) {
    batch.push({
      updateMany: {
        filter: { content, status: "NEED_AUTO_TRANSLATE" },
        update: { $set: { languages, status } },
      },
    });

    if (batch.length >= BATCH_SIZE) {
      const result = await collection.bulkWrite(batch, { ordered: false });
      updatedCount += result.modifiedCount;
      batch = [];
    }
  }

  if (batch.length > 0) {
    const result = await collection.bulkWrite(batch, { ordered: false });
    updatedCount += result.modifiedCount;
  }

  logger.info(`[MIGRATION] Updated ${updatedCount} translatedField documents`);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const down = (_db: Db) => {
  logger.info(
    `[ROLLBACK] - ${message} — no rollback possible, translations cannot be un-propagated`
  );
};
