import {
  ApiPlace,
  CountryCodes,
  getPosition,
  PlaceStatus,
  Themes,
} from "@soliguide/common";

import { logger } from "../../../general/logger";
import { FRONT_URLS_MAPPINGS } from "../../../_models/config/constants/domains/THEMES_MAPPING.const";
import { PlaceModel } from "../../../place/models/place.model";
import {
  AmqpSynchroAirtablePlaceEvent,
  amqpEventsSender,
  Exchange,
  RoutingKey,
} from "../../../events";
import { ModelWithId } from "../../../_models";

const COUNTRY_TO_THEME: Record<string, Themes> = {
  [CountryCodes.FR]: Themes.SOLIGUIDE_FR,
  [CountryCodes.ES]: Themes.SOLIGUIA_ES,
  [CountryCodes.AD]: Themes.SOLIGUIA_AD,
};

const BATCH_SIZE = 5000;
const THROTTLE_BATCH_SIZE = 50;
const THROTTLE_DELAY_MS = 1000;

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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function syncPlacesToAirtableJob(): Promise<void> {
  logger.info("JOB - SYNC ALL PLACES TO AIRTABLE\tSTART");

  const filter = {
    status: { $nin: [PlaceStatus.DRAFT, PlaceStatus.PERMANENTLY_CLOSED] },
  };

  let lastId: string | null = null;
  let totalSent = 0;
  let throttleCpt = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const paginatedFilter = {
      ...(lastId ? { _id: { $gt: lastId } } : {}),
      ...filter,
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
      const { theme, frontendUrl } = getThemeAndUrlFromPlace(place);

      const payload = new AmqpSynchroAirtablePlaceEvent(
        place,
        frontendUrl,
        theme
      );

      await amqpEventsSender.sendToQueue(
        Exchange.SYNCHRO_AT,
        `${RoutingKey.SYNCHRO_AT}.place`,
        payload
      );

      totalSent++;
      throttleCpt++;

      if (throttleCpt >= THROTTLE_BATCH_SIZE) {
        await sleep(THROTTLE_DELAY_MS);
        throttleCpt = 0;
      }
    }

    logger.info(`SYNC AIRTABLE - ${totalSent} places sent so far`);
  }

  logger.info(
    `JOB - SYNC ALL PLACES TO AIRTABLE\tEND - ${totalSent} places sent`
  );
}
