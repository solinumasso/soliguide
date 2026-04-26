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
import { Db, ObjectId } from "mongodb";

import { ApiPlace, CountryCodes, getPosition, Themes } from "@soliguide/common";

import { logger } from "../src/general/logger";
import { FRONT_URLS_MAPPINGS } from "../src/_models/config/constants/domains/THEMES_MAPPING.const";
import { amqpEventsSender } from "../src/events/services/AmqpEventsSender";
import { AmqpSynchroAirtablePlaceEvent } from "../src/events/classes/AmqpSynchroAirtablePlaceEvent.class";
import { Exchange, RoutingKey } from "../src/events/enums";
import { CONFIG } from "../src/_models/config";
import type { ModelWithId } from "../src/_models";

const BATCH_SIZE = 5000;
const THROTTLE_BATCH_SIZE = 50;
const THROTTLE_DELAY_MS = 1000;

const COUNTRY_TO_THEME: Record<string, Themes> = {
  [CountryCodes.FR]: Themes.SOLIGUIDE_FR,
  [CountryCodes.ES]: Themes.SOLIGUIA_ES,
  [CountryCodes.AD]: Themes.SOLIGUIA_AD,
};

export const up = async (db: Db) => {
  logger.info("[MIGRATION] - Sync all places to Airtable");

  if (!CONFIG.AMQP_URL) {
    logger.warn("[MIGRATION] - AMQP_URL not configured, skipping");
    return;
  }

  const collection = db.collection("lieux");
  const total = await collection.countDocuments({});
  logger.info(`[MIGRATION] - ${total} places to sync`);

  let sent = 0;
  let errors = 0;
  let throttleCpt = 0;
  let lastId: ObjectId | null = null;

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const places = await collection
        .find<ModelWithId<ApiPlace>>(lastId ? { _id: { $gt: lastId } } : {})
        .sort({ _id: 1 })
        .limit(BATCH_SIZE)
        .toArray();

      if (places.length === 0) break;

      lastId = places[places.length - 1]._id;

      for (const place of places) {
        try {
          const position = getPosition(place);
          const theme =
            (position?.country && COUNTRY_TO_THEME[position.country]) ||
            Themes.SOLIGUIDE_FR;

          await amqpEventsSender.sendToQueue(
            Exchange.SYNCHRO_AT,
            `${RoutingKey.SYNCHRO_AT}.place`,
            new AmqpSynchroAirtablePlaceEvent(
              place,
              `${FRONT_URLS_MAPPINGS[theme]}/`,
              theme
            )
          );

          sent++;
          if (++throttleCpt >= THROTTLE_BATCH_SIZE) {
            await new Promise((resolve) =>
              setTimeout(resolve, THROTTLE_DELAY_MS)
            );
            throttleCpt = 0;
          }
        } catch (e) {
          logger.error(e, `[MIGRATION] - Failed to sync place ${place._id}`);
          errors++;
        }
      }

      logger.info(`[MIGRATION] - Progress: ${sent}/${total}`);
    }

    logger.info(`[MIGRATION] - Done: ${sent} sent, ${errors} errors`);
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
  logger.info("[MIGRATION ROLLBACK] - Sync all places to Airtable (no-op)");
};
