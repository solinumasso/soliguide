/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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
// Rate limits: 20 req/sec and 72 000 req/hour (same constraint).
// At BATCH_SIZE=100, each batch must be spaced at least 100/20 = 5s apart.
// Using 7s to give n8n comfortable margin to drain before the next batch lands.
const DELAY_BETWEEN_BATCHES_MS = 7_000;

const QUERY = { status: { $in: [UserStatus.PRO, UserStatus.ADMIN_TERRITORY] } };

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
  const totalCount = await usersCollection.countDocuments(QUERY);
  logger.info(`[MIGRATION] - Found ${totalCount} pro users to sync to Brevo`);

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
