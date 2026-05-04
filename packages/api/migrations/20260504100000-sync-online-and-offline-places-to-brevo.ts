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

import {
  ApiPlace,
  CountryCodes,
  getPosition,
  PlaceStatus,
  Themes,
} from "@soliguide/common";

import { logger } from "../src/general/logger";
import { amqpEventsSender } from "../src/events/services/AmqpEventsSender";
import { AmqpSynchroAirtablePlaceEvent } from "../src/events/classes/AmqpSynchroAirtablePlaceEvent.class";
import { Exchange, RoutingKey } from "../src/events/enums";
import { CONFIG } from "../src/_models/config";
import { FRONT_URLS_MAPPINGS } from "../src/_models/config/constants/domains/THEMES_MAPPING.const";
import type { ModelWithId } from "../src/_models";

const message = "Sync online and offline places to Brevo via AMQP";
const BATCH_SIZE = 100;
// Rate limits: 20 req/sec → each batch of 100 must be spaced at least 100/20 = 5s apart.
// Using 7s to give n8n comfortable margin to drain before the next batch lands.
const DELAY_BETWEEN_BATCHES_MS = 7_000;

const COUNTRY_TO_THEME: Record<string, Themes> = {
  [CountryCodes.FR]: Themes.SOLIGUIDE_FR,
  [CountryCodes.ES]: Themes.SOLIGUIA_ES,
  [CountryCodes.AD]: Themes.SOLIGUIA_AD,
};

function getThemeAndUrlFromPlace(place: ApiPlace): {
  theme: Themes;
  frontendUrl: string;
} {
  const position = getPosition(place);
  const country = position?.country;
  const theme = (country && COUNTRY_TO_THEME[country]) || Themes.SOLIGUIDE_FR;
  const frontendUrl = `${FRONT_URLS_MAPPINGS[theme]}/`;
  return { theme, frontendUrl };
}

const QUERY = {
  status: { $in: [PlaceStatus.ONLINE, PlaceStatus.OFFLINE] },
};

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  if (!CONFIG.AMQP_URL) {
    logger.warn(
      "[MIGRATION] - AMQP_URL not configured, skipping Brevo place sync"
    );
    return;
  }

  const placesCollection = db.collection("lieux");
  const totalCount = await placesCollection.countDocuments(QUERY);
  logger.info(
    `[MIGRATION] - Found ${totalCount} online and offline places to sync to Brevo`
  );

  let processedCount = 0;
  let errorCount = 0;

  try {
    for (let skip = 0; skip < totalCount; skip += BATCH_SIZE) {
      const batch = await placesCollection
        .find<ModelWithId<ApiPlace>>(QUERY)
        .sort({ _id: 1 })
        .skip(skip)
        .limit(BATCH_SIZE)
        .toArray();

      const results = await Promise.allSettled(
        batch.map((place) => {
          const { theme, frontendUrl } = getThemeAndUrlFromPlace(place);
          const payload = new AmqpSynchroAirtablePlaceEvent(
            place,
            frontendUrl,
            theme
          );
          return amqpEventsSender.sendToQueue(
            Exchange.SYNCHRO_AT,
            `${RoutingKey.SYNCHRO_AT}.place`,
            payload
          );
        })
      );

      for (const [i, result] of results.entries()) {
        if (result.status === "rejected") {
          logger.error(
            result.reason,
            `[MIGRATION] - Failed to sync place ${String(batch[i]._id)}`
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
      `[MIGRATION] - Brevo sync complete: ${processedCount} places published, ${errorCount} errors`
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
