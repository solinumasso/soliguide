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

import { logger } from "../src/general/logger";
import { CampaignName } from "@soliguide/common/dist/cjs/campaign/enums/CampaignName.enum";

const message = "Updtate IDF mail and name contact in campaign templates";

export const down = async () => {
  logger.info(`[ROLLBACK] - ${message}`);
};

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const idfDepartments = ["75", "77", "78", "91", "92", "93", "94", "95"];

  await db.collection("emailsTemplates").updateMany(
    {
      campaign: CampaignName.MID_YEAR_2025,
      territory: { $in: idfDepartments },
    },
    {
      $set: {
        senderEmail: "soliguide.idf@solinum.org",
        senderName: "Soliguide Île-de-France",
      },
    }
  );

  logger.info(`[MIGRATION] - IDF mail and name contact updated in templates`);
};
