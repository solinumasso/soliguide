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

import { CAMPAIGN_DEFAULT_NAME, FR_DEPARTMENT_CODES } from "@soliguide/common";
import { logger } from "../../src/general/logger";
import {
  CampaignEmailTemplates,
  PARTNER_CAMPAIGN_EMAIL_TEMPLATE,
} from "../../src/_models";
import { getSenderData } from "../../src/emailing/utils/getSenderData";
import { Partners } from "../../src/partners";

const message = "Generate campaign mails templates";

export const down = async (db: Db) => {
  logger.info(`[ROLLBACK] - ${message}`);
  await db
    .collection("emailsTemplates")
    .deleteMany({ campaign: CAMPAIGN_DEFAULT_NAME });
};

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);

  const emailsTemplates: CampaignEmailTemplates[] = [];

  for (const territory of FR_DEPARTMENT_CODES) {
    Object.keys(PARTNER_CAMPAIGN_EMAIL_TEMPLATE).forEach(
      (partner: Partners) => {
        if (PARTNER_CAMPAIGN_EMAIL_TEMPLATE[partner]) {
          emailsTemplates.push({
            campaign: CAMPAIGN_DEFAULT_NAME,
            confirm: false,
            confirmDate: null,
            emails: PARTNER_CAMPAIGN_EMAIL_TEMPLATE[partner],
            senderEmail: getSenderData(territory, "senderEmail"),
            senderName: getSenderData(territory, "senderName"),
            territory,
            partner,
          });
        }
      }
    );
  }
  if (emailsTemplates.length) {
    await db.collection("emailsTemplates").insertMany(emailsTemplates);
  }
};
