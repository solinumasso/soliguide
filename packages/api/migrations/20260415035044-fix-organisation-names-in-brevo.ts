import { Db } from "mongodb";

import { UserStatus } from "@soliguide/common";

import { logger } from "../src/general/logger";
import { amqpEventsSender } from "../src/events/services/AmqpEventsSender";
import { AmqpSynchroAirtableUserEvent } from "../src/events/classes/AmqpSynchroAirtableUserEvent.class";
import { Exchange, RoutingKey } from "../src/events/enums";
import { CONFIG } from "../src/_models/config";
import type { ModelWithId, User } from "../src/_models";

const message = "Sync pro users with organizations and roles to Brevo";
const BATCH_SIZE = 25;
const DELAY_BETWEEN_BATCHES_MS = 3_000;

const QUERY = {
  status: { $in: [UserStatus.PRO, UserStatus.ADMIN_TERRITORY] },
  organizations: { $exists: true, $ne: [] },
};

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  if (!CONFIG.AMQP_URL) {
    logger.warn(
      "[MIGRATION] - AMQP_URL not configured, skipping Brevo user sync"
    );
    return;
  }

  const usersCollection = db.collection("users");
  const orgCollection = db.collection("organization");
  const userRightsCollection = db.collection("userRights");
  const totalCount = await usersCollection.countDocuments(QUERY);
  logger.info(
    `[MIGRATION] - Found ${totalCount} pro users with organizations to sync`
  );

  let processedCount = 0;
  let errorCount = 0;

  try {
    for (let skip = 0; skip < totalCount; skip += BATCH_SIZE) {
      const batch = await usersCollection
        .find<ModelWithId<User>>(QUERY)
        .sort({ _id: 1 })
        .skip(skip)
        .limit(BATCH_SIZE)
        .toArray();

      for (const user of batch) {
        if (user.organizations?.length) {
          const orgs = await orgCollection
            .find({ _id: { $in: user.organizations } })
            .toArray();
          user.organizations = orgs as any;
        }

        const userRights = await userRightsCollection
          .find({ user: user._id })
          .toArray();
        if (userRights.length) {
          (user as any).userRights = userRights;
        }
      }

      const results = await Promise.allSettled(
        batch.map((user) => {
          const payload = new AmqpSynchroAirtableUserEvent(
            user,
            "",
            null,
            false
          );
          return amqpEventsSender.sendToQueue(
            Exchange.SYNCHRO_AT,
            `${RoutingKey.SYNCHRO_AT}.user`,
            payload
          );
        })
      );

      for (const [i, result] of results.entries()) {
        if (result.status === "rejected") {
          logger.error(
            result.reason,
            `[MIGRATION] - Failed to sync user ${String(batch[i]._id)}`
          );
          errorCount++;
        } else {
          processedCount++;
        }
      }

      logger.info(
        `[MIGRATION] - Progress: ${processedCount}/${totalCount} synced`
      );

      if (skip + BATCH_SIZE < totalCount) {
        await new Promise((resolve) =>
          setTimeout(resolve, DELAY_BETWEEN_BATCHES_MS)
        );
      }
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
