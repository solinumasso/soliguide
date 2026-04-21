import { Db } from "mongodb";

import { UserStatus } from "@soliguide/common";

import { logger } from "../src/general/logger";
import { amqpEventsSender } from "../src/events/services/AmqpEventsSender";
import { AmqpSynchroAirtableUserEvent } from "../src/events/classes/AmqpSynchroAirtableUserEvent.class";
import { Exchange, RoutingKey } from "../src/events/enums";
import { CONFIG } from "../src/_models/config";
import type { ModelWithId, User } from "../src/_models";

const message = "Sync all pro users to Brevo";
const BATCH_SIZE = 100;

/** Publishes a batch of users to the AMQP queue for Brevo sync. */
const publishBatch = async (
  users: ModelWithId<User>[]
): Promise<{ processed: number; errors: number }> => {
  let processed = 0;
  let errors = 0;

  for (const user of users) {
    try {
      const payload = new AmqpSynchroAirtableUserEvent(user, "", null, false);

      await amqpEventsSender.sendToQueue(
        Exchange.SYNCHRO_AT,
        `${RoutingKey.SYNCHRO_AT}.user`,
        payload
      );

      processed++;
    } catch (e) {
      logger.error(e, `[MIGRATION] - Failed to sync user ${String(user._id)}`);
      errors++;
    }
  }

  return { processed, errors };
};

/** Syncs all pro and admin-territory users to Brevo via AMQP. */
export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  if (!CONFIG.AMQP_URL) {
    logger.warn(
      "[MIGRATION] - AMQP_URL not configured, skipping Brevo user sync"
    );
    return;
  }

  const usersCollection = db.collection("users");

  const totalCount = await usersCollection.countDocuments({
    status: { $in: [UserStatus.PRO, UserStatus.ADMIN_TERRITORY] },
  });
  logger.info(`[MIGRATION] - Found ${totalCount} pro users to sync to Brevo`);

  let processedCount = 0;
  let errorCount = 0;

  const cursor = usersCollection.find<ModelWithId<User>>({
    status: { $in: [UserStatus.PRO, UserStatus.ADMIN_TERRITORY] },
  });

  let batch: ModelWithId<User>[] = [];

  try {
    for await (const user of cursor) {
      batch.push(user);

      if (batch.length >= BATCH_SIZE) {
        const results = await publishBatch(batch);
        processedCount += results.processed;
        errorCount += results.errors;
        batch = [];
        logger.info(
          `[MIGRATION] - Progress: ${processedCount}/${totalCount} synced`
        );
      }
    }

    if (batch.length > 0) {
      const results = await publishBatch(batch);
      processedCount += results.processed;
      errorCount += results.errors;
    }

    logger.info(
      `[MIGRATION] - Brevo sync complete: ${processedCount} users published, ${errorCount} errors`
    );
  } finally {
    try {
      await amqpEventsSender.close();
    } catch (e) {
      logger.error(e, "[MIGRATION] - Failed to close AMQP connection");
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const down = (_db: Db) => {
  logger.info(
    `[MIGRATION ROLLBACK] - ${message} (no-op: cannot unsync Brevo contacts from API)`
  );
};
