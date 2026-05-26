import "../instrument";

import mongoose from "mongoose";

import {
  CountryCodes,
  PlaceStatus,
  Themes,
  getPosition,
} from "@soliguide/common";

import { connectToDatabase } from "../config/database/connection";
import { logger } from "../general/logger";
import { PlaceModel } from "../place/models/place.model";
import { AmqpSynchroAirtablePlaceEvent } from "../events/classes/AmqpSynchroAirtablePlaceEvent.class";
import type { ApiPlace } from "@soliguide/common";
import type { ModelWithId } from "../_models";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_BATCH_URL = "https://api.brevo.com/v3/objects/place/batch/upsert";

const IS_TEST = process.argv.includes("--test");
const BATCH_SIZE = IS_TEST ? 5 : 5000;
const BREVO_BATCH_SIZE = 1000;
const THROTTLE_DELAY_MS = 10_000;

const CAMPAIGN_STATUS_MAP: Record<string, string> = {
  TO_DO: "to_do",
  STARTED: "started",
  FINISHED: "finished",
  NO_CHANGE: "no_change",
  REMIND: "remind_me",
  CHANGED: "changed",
};

const PROD_FRONT_URLS: Record<Themes, string> = {
  [Themes.SOLIGUIDE_FR]: "https://soliguide.fr",
  [Themes.SOLIGUIA_ES]: "https://soliguia.es",
  [Themes.SOLIGUIA_AD]: "https://soliguia.ad",
};

const COUNTRY_TO_THEME: Record<string, Themes> = {
  [CountryCodes.FR]: Themes.SOLIGUIDE_FR,
  [CountryCodes.ES]: Themes.SOLIGUIA_ES,
  [CountryCodes.AD]: Themes.SOLIGUIA_AD,
};

function getThemeAndUrlFromPlace(place: ModelWithId<ApiPlace>): {
  theme: Themes;
  frontendUrl: string;
} {
  const position = getPosition(place);
  const country = position?.country;
  const theme = (country && COUNTRY_TO_THEME[country]) || Themes.SOLIGUIDE_FR;
  const frontendUrl = `${PROD_FRONT_URLS[theme]}/`;

  return { theme, frontendUrl };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toBrevoRecord(event: AmqpSynchroAirtablePlaceEvent) {
  return {
    attributes: {
      name: event.name ?? "",
      organisation: event.organization?.[0]?.name ?? "",
      id: event.placeId,
      type:
        (event.placeType ?? "").trim() === "PARCOURS_MOBILE"
          ? "parcours_mobile"
          : "structure_fixe",
      online_state: (event.status ?? "").trim().toLowerCase(),
      adresse: event.address ?? "",
      postal_code: parseInt(event.postalCode ?? "0") || 0,
      schedules: event.schedules ?? "",
      temporary_schedules: event.temporarySchedules ?? "",
      phone_number: (event.phones ?? "").split("\n")[0] ?? "",
      services: (event.services ?? []).join(", "),
      update_campaign_state:
        CAMPAIGN_STATUS_MAP[(event.campaignStatus ?? "").trim()] ?? "",
      update_campaign_link: event.updateCampaignLink ?? "",
      public_site_link: event.publicSiteLink ?? "",
      update_campaign_mid_year: event.updateCampaignMidYear ?? false,
      update_campaign_end_year: event.updateCampaignEndYear ?? false,
      all_places_link: event.allPlacesLink ?? "",
    },
    identifiers: {
      ext_id: String(event.placeId),
    },
  };
}

async function postToBrevo(
  records: ReturnType<typeof toBrevoRecord>[],
  attempt = 1
): Promise<void> {
  const response = await fetch(BREVO_BATCH_URL, {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ records }),
  });

  if (response.status === 429) {
    if (attempt >= 5) {
      throw new Error("Brevo API rate limit exceeded after 5 retries");
    }
    const resetIn = response.headers.get("x-sib-ratelimit-reset");
    const waitMs = resetIn ? parseInt(resetIn) * 1000 : attempt * 60_000;
    logger.warn(
      `Brevo 429 - quota exhausted, waiting ${
        waitMs / 1000
      }s for reset (attempt ${attempt}/5)`
    );
    await sleep(waitMs);
    return postToBrevo(records, attempt + 1);
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Brevo API error ${response.status}: ${body}`);
  }

  const remaining = response.headers.get("x-sib-ratelimit-remaining");
  const resetIn = response.headers.get("x-sib-ratelimit-reset");

  if (remaining !== null && parseInt(remaining) === 0 && resetIn !== null) {
    const waitMs = parseInt(resetIn) * 1000;
    logger.info(
      `Brevo rate limit reached, waiting ${waitMs / 1000}s for quota reset`
    );
    await sleep(waitMs);
  }
}

async function run(): Promise<void> {
  if (!BREVO_API_KEY) {
    logger.error("BREVO_API_KEY is not set");
    process.exit(1);
  }

  await connectToDatabase();

  logger.info(
    IS_TEST
      ? "SCRIPT - SYNC ONLINE/OFFLINE PLACES TO BREVO\tTEST (5 places)"
      : "SCRIPT - SYNC ONLINE/OFFLINE PLACES TO BREVO\tSTART"
  );

  let lastId: string | null = null;
  let totalSent = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const paginatedFilter = {
      status: { $in: [PlaceStatus.ONLINE, PlaceStatus.OFFLINE] },
      ...(lastId ? { _id: { $gt: new mongoose.Types.ObjectId(lastId) } } : {}),
    };

    const places = await PlaceModel.aggregate<ModelWithId<ApiPlace>>([
      { $match: paginatedFilter },
      { $sort: { _id: 1 } },
      { $limit: BATCH_SIZE },
      {
        $lookup: {
          from: "organization",
          localField: "_id",
          foreignField: "places",
          as: "organizations",
          pipeline: [{ $project: { name: 1, organization_id: 1, _id: 0 } }],
        },
      },
    ]);

    if (places.length === 0) {
      break;
    }

    if (IS_TEST) {
      logger.info(
        {
          records: places.map((p) => ({
            id: p.lieu_id,
            name: p.name,
            status: p.status,
          })),
        },
        "TEST - places to send"
      );
    }

    lastId = places[places.length - 1]._id.toString();

    const records = places.map((place) => {
      const { theme, frontendUrl } = getThemeAndUrlFromPlace(place);
      const event = new AmqpSynchroAirtablePlaceEvent(
        place,
        frontendUrl,
        theme
      );
      return toBrevoRecord(event);
    });

    for (let i = 0; i < records.length; i += BREVO_BATCH_SIZE) {
      const batch = records.slice(i, i + BREVO_BATCH_SIZE);
      await postToBrevo(batch);
      totalSent += batch.length;

      await sleep(THROTTLE_DELAY_MS);
    }

    logger.info(`SYNC BREVO PLACES - ${totalSent} places sent so far`);

    if (IS_TEST) {
      break;
    }
  }

  logger.info(
    `SCRIPT - SYNC ONLINE/OFFLINE PLACES TO BREVO\tEND - ${totalSent} places sent`
  );

  await mongoose.connection.close();
}

run().catch((err) => {
  logger.error(err, "SYNC BREVO PLACES - Fatal error");
  process.exit(1);
});
