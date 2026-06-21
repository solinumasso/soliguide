import { ApiPlace } from "@soliguide/common";

import { logger } from "../../../general/logger";
import { PlaceModel } from "../../../place/models/place.model";
import { getThemeAndUrlFromPlace } from "../../../place/utils";
import {
  AmqpSynchroAirtablePlaceEvent,
  amqpEventsSender,
  Exchange,
  RoutingKey,
} from "../../../events";
import { ModelWithId } from "../../../_models";

const BATCH_SIZE = 5000;
const THROTTLE_BATCH_SIZE = 50;
const THROTTLE_DELAY_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function syncPlacesToAirtableJob(): Promise<void> {
  logger.info("JOB - SYNC ALL PLACES TO AIRTABLE\tSTART");

  let lastId: string | null = null;
  let totalSent = 0;
  let throttleCpt = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const paginatedFilter = {
      ...(lastId ? { _id: { $gt: lastId } } : {}),
    };

    const places: ModelWithId<ApiPlace>[] = await PlaceModel.find<
      ModelWithId<ApiPlace>
    >(paginatedFilter)
      .sort({ _id: 1 })
      .limit(BATCH_SIZE)
      .exec();

    if (places.length === 0) {
      break;
    }

    lastId = places[places?.length - 1]._id ?? null;

    for (const place of places) {
      try {
        const { theme, frontendUrl } = getThemeAndUrlFromPlace(place);

        const payload = new AmqpSynchroAirtablePlaceEvent(
          place,
          frontendUrl,
          theme
        );

        await amqpEventsSender.sendToQueue(
          Exchange.PLACES,
          `${RoutingKey.PLACES}.synchro_at_all`,
          payload
        );

        totalSent++;
        throttleCpt++;

        if (throttleCpt >= THROTTLE_BATCH_SIZE) {
          await sleep(THROTTLE_DELAY_MS);
          throttleCpt = 0;
        }
      } catch (err) {
        logger.error(
          `SYNC AIRTABLE - failed to send place ${place.lieu_id} (_id: ${place._id}): ${err}`
        );
      }
    }

    logger.info(`SYNC AIRTABLE - ${totalSent} places sent so far`);
  }

  logger.info(
    `JOB - SYNC ALL PLACES TO AIRTABLE\tEND - ${totalSent} places sent`
  );
}
