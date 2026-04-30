import { Db } from "mongodb";

import { CampaignName, PlaceUpdateCampaign } from "@soliguide/common";

import { logger } from "../src/general/logger";
import {
  countryIncludeInMAJ,
  excludeBasicServicesFilter,
  sourceToIncludeInMaj,
  statusIncludeInMAJ,
} from "./templates/campaigns/filtersToResetCampaign";

const CAMPAIGN_NAME = CampaignName.MID_YEAR_2026;
const message = `Reset campaign ${CAMPAIGN_NAME}`;

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  // Reset campaign field on all places
  await db
    .collection("lieux")
    .updateMany(
      {},
      { $set: { [`campaigns.${CAMPAIGN_NAME}`]: new PlaceUpdateCampaign() } }
    );

  logger.info(`[MIGRATION] - ${message} - campaign field reset on all places`);

  // Mark places to update based on criteria
  const result = await db.collection("lieux").updateMany(
    {
      ...countryIncludeInMAJ,
      ...statusIncludeInMAJ,
      ...excludeBasicServicesFilter,
      ...sourceToIncludeInMaj,
    },
    { $set: { [`campaigns.${CAMPAIGN_NAME}.toUpdate`]: true } }
  );

  logger.info(
    `[MIGRATION] - ${message} - ${result.modifiedCount} places marked toUpdate`
  );

  // Get ids of places marked to update
  const places = await db
    .collection("lieux")
    .find(
      { [`campaigns.${CAMPAIGN_NAME}.toUpdate`]: true },
      { projection: { _id: 1 } }
    )
    .toArray();

  const placeIds = places.map((place) => place._id);

  // Reset campaign field on all organizations
  await db
    .collection("organization")
    .updateMany(
      {},
      { $set: { [`campaigns.${CAMPAIGN_NAME}`]: { toUpdate: false } } }
    );

  // Mark organizations with at least one place to update
  if (placeIds.length > 0) {
    const orgResult = await db
      .collection("organization")
      .updateMany(
        { places: { $in: placeIds } },
        { $set: { [`campaigns.${CAMPAIGN_NAME}.toUpdate`]: true } }
      );

    logger.info(
      `[MIGRATION] - ${message} - ${orgResult.modifiedCount} organizations marked toUpdate`
    );
  }
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  await db
    .collection("lieux")
    .updateMany({}, { $unset: { [`campaigns.${CAMPAIGN_NAME}`]: "" } });

  await db
    .collection("organization")
    .updateMany({}, { $unset: { [`campaigns.${CAMPAIGN_NAME}`]: "" } });
};
