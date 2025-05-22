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
import { AllCampaign, CountryCodes, DEPARTMENT_CODES } from "@soliguide/common";
import { Db } from "mongodb";
import { logger } from "../../src/general/logger";
import { REMIND_ME_CAMPAIGN_MAILS_CONTENT } from "../../src/_models";
import { getSenderData } from "../../src/emailing/utils/getSenderData";

const message = "Update Remind-Me mails templates";

export const down = () => {
  logger.info("ROLLBACK IMPOSSIBLE");
};

export const up = async (db: Db) => {
  logger.info(`[MIGRATION] - ${message}`);
  await db
    .collection("emailsTemplates")
    .deleteMany({ campaign: "ALL_CAMPAIGN" });

  const emailsTemplates = [];

  for (const territory of DEPARTMENT_CODES[CountryCodes.FR]) {
    emailsTemplates.push({
      confirm: false,
      campaign: AllCampaign.ALL_CAMPAIGN,
      confirmDate: null,
      emails: REMIND_ME_CAMPAIGN_MAILS_CONTENT,
      senderEmail: getSenderData(territory, "senderEmail"),
      senderName: getSenderData(territory, "senderName"),
      territory,
    });
  }

  if (emailsTemplates.length) {
    await db.collection("emailsTemplates").insertMany(emailsTemplates);
  }
};
