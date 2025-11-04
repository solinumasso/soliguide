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
import {
  CAMPAIGN_DEFAULT_NAME,
  EXTERNAL_UPDATES_ONLY_SOURCES,
  PlaceStatus,
} from "@soliguide/common";
import { Db, ObjectId } from "mongodb";

import { logger } from "../src/general/logger";

const message = "Database monitoring - count documents and campaign status";

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  // ===================
  // SECTION USERS
  // ===================
  logger.info("========================================");
  logger.info("SECTION USERS - Monitoring");
  logger.info("========================================");

  // Total users
  const totalUsers = await db.collection("users").countDocuments({});
  logger.info(`[USERS] Total documents: ${totalUsers}`);

  // Users with campaigns.CAMPAIGN_DEFAULT_NAME defined
  const usersWithCampaign = await db.collection("users").countDocuments({
    [`campaigns.${CAMPAIGN_DEFAULT_NAME}`]: { $exists: true },
  });

  logger.info(
    `[USERS] ${
      totalUsers - usersWithCampaign
    } users without new campaign, shoud have 0`
  );

  // ===================
  // SECTION LIEUX
  // ===================
  logger.info("========================================");
  logger.info("SECTION LIEUX - Monitoring");
  logger.info("========================================");

  // Total lieux
  const totalLieux = await db.collection("lieux").countDocuments({});
  logger.info(`[LIEUX] Total documents: ${totalLieux}`);

  const externalSourceOriginFilter = {
    name: { $nin: EXTERNAL_UPDATES_ONLY_SOURCES },
    isOrigin: false,
  };

  // Lieux to update
  const lieuxToUpdate = await db.collection("lieux").countDocuments({
    status: { $in: [PlaceStatus.ONLINE, PlaceStatus.OFFLINE] },
    $or: [
      { sources: { $eq: [] } },
      {
        sources: {
          $elemMatch: externalSourceOriginFilter,
        },
      },
    ],
  });

  logger.info(`[LIEUX] To update: ${lieuxToUpdate}`);

  // Lieux with campaigns.CAMPAIGN_DEFAULT_NAME defined
  const lieuxWithCampaign = await db.collection("lieux").countDocuments({
    [`campaigns.${CAMPAIGN_DEFAULT_NAME}`]: { $exists: true },
  });

  logger.info(
    `[LIEUX]${
      totalLieux - lieuxWithCampaign
    } lieux without new campaign, shoud have 0`
  );

  // Lieux with campaigns.CAMPAIGN_DEFAULT_NAME.toUpdate = true
  const lieuxCampaignToUpdateTrue = await db
    .collection("lieux")
    .countDocuments({
      [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: true,
    });
  logger.info(
    `[LIEUX] ${lieuxCampaignToUpdateTrue} with campaign.toUpdate = true, ${lieuxToUpdate} expected`
  );

  // ===================
  // SECTION ORGANIZATIONS
  // ===================
  logger.info("========================================");
  logger.info("SECTION ORGANIZATIONS - Monitoring");
  logger.info("========================================");

  // Total organizations
  const totalOrganizations = await db
    .collection("organization")
    .countDocuments({});
  logger.info(`[ORGANIZATIONS] Total documents: ${totalOrganizations}`);

  const organizationsWithCampaign = await db
    .collection("organization")
    .countDocuments({
      [`campaigns.${CAMPAIGN_DEFAULT_NAME}`]: { $exists: true },
    });
  logger.info(
    `[ORGANIZATIONS] ${
      totalOrganizations - organizationsWithCampaign
    } without new campaign, should have 0`
  );

  const places = await db
    .collection("lieux")
    .find({ [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: true })
    .project({ _id: 1 })
    .toArray();

  const placeIds = places.map((place: { _id: ObjectId }) => place._id);

  const organizationsCampaignToUpdate = await db
    .collection("organization")
    .countDocuments({ places: { $in: placeIds } });

  // Organizations with campaigns.CAMPAIGN_DEFAULT_NAME.toUpdate = true
  const organizationsCampaignToUpdateTrue = await db
    .collection("organization")
    .countDocuments({
      [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: true,
    });
  logger.info(
    `[ORGANIZATIONS] ${organizationsCampaignToUpdateTrue} with campaign.toUpdate = true, ${organizationsCampaignToUpdate} expected`
  );

  logger.info("========================================");
  logger.info("Monitoring complete");
  logger.info("========================================");
};

export const down = async () => {
  logger.info(`[ROLLBACK] - ${message}`);
  logger.info("No rollback needed for monitoring migration");
};
