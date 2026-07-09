import { Db } from "mongodb";

import {
  CampaignLifecycleStatus,
  CountryCodes,
  FR_DEPARTMENT_CODES,
  type Campaign,
} from "@soliguide/common";

import { logger } from "../src/general/logger";

const message = "Seed campaign canicule-france-2026";
const collectionName = "campaigns";
const SLUG = "canicule-france-2026";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const collection = db.collection<Campaign>(collectionName);

  const existing = await collection.findOne({ slug: SLUG });
  if (existing) {
    logger.info(`[MIGRATION] - campaign '${SLUG}' already exists, exiting`);
    return;
  }

  const now = new Date();
  const campaign: Omit<Campaign, "createdAt" | "updatedAt"> = {
    slug: SLUG,
    name: "Canicule France 2026",
    description:
      "Mise à jour rapide du confort thermique des lieux (climatisation) pendant la période caniculaire.",
    status: CampaignLifecycleStatus.ACTIVE,
    country: CountryCodes.FR,
    territories: [...FR_DEPARTMENT_CODES],
    structureTypes: [],
    sectionsToUpdate: ["modalities"],
    startDate: new Date("2026-06-01T00:00:00.000Z"),
    endDate: new Date("2026-09-30T23:59:59.000Z"),
  };

  await collection.insertOne({
    ...campaign,
    createdAt: now,
    updatedAt: now,
  } as Campaign);

  logger.info(`[MIGRATION] - done: campaign '${SLUG}' inserted`);
};

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);

  const result = await db.collection(collectionName).deleteOne({ slug: SLUG });

  logger.info(`[ROLLBACK] - done: ${result.deletedCount} campaign deleted`);
};
