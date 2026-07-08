/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2026 Solinum
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
