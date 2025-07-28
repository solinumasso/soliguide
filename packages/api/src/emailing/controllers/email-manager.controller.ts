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
import type { FilterQuery, QueryOptions } from "mongoose";
import { CAMPAIGN_DEFAULT_NAME } from "@soliguide/common";
import { mgGetEvent } from "../services/mailgun.service";
import {
  countEmailsManage,
  findEmails,
  findEmailsToUpdate,
  findOne,
  updateManyEmailCampaign,
  updatOneEmailCampaign,
} from "../services/email-campaign.service";
import { getEventType } from "../utils/getEventType";
import {
  MG_EVENT_STRING_SORTED,
  CampaignEmailNameToSync,
  type CampaignEmails,
} from "../../_models";

import { logger } from "../../general/logger";

import { updateUser } from "../../user/services";
import { PosthogClient } from "../../analytics/services";
import { TRACKED_EVENTS } from "../../analytics/constants";
import { generateSearchOptions, parseTerritories } from "../../search/utils";
import { User, UserPopulateType } from "../../user/interfaces";

export const searchEmail = async (searchEmail: any, user: UserPopulateType) => {
  const query: FilterQuery<CampaignEmails> = {};

  if (searchEmail.campaigns) {
    query.campaign = { $in: searchEmail.campaigns };
  }

  if (searchEmail.lastStatus) {
    if (searchEmail.lastStatus === "BOUNCED_PERM") {
      query.lastStatus = {
        $in: ["BOUNCED_PERM", "BOUNCED_TEMP", "REJECTED"],
      };
    } else {
      query.lastStatus = searchEmail.lastStatus;
    }
  }

  if (searchEmail.emailType) {
    query.emailType = searchEmail.emailType;
  }

  if (typeof searchEmail.orgaId === "number") {
    query["info.organization_id"] = searchEmail.orgaId;
  }

  if (searchEmail.recipientEmail) {
    query.recipientEmail = {
      $options: "i",
      $regex: new RegExp(`.*${searchEmail.recipientEmail}.*`),
    };
  }

  if (searchEmail.territories) {
    const tempQuery = { territories: {} };
    parseTerritories(tempQuery, searchEmail, "territories", user);
    query["info.territory"] = tempQuery.territories;
  }

  const nbResults = await countEmailsManage(query);

  const options: QueryOptions = generateSearchOptions(
    nbResults,
    searchEmail.options
  );

  const emails = await findEmails(query, options);

  return {
    emails,
    nbResults,
  };
};

export const findOneEmail = async (_id: string) => {
  return await findOne(_id);
};

// Campaign
export const updateEmailStatus = async () => {
  const emails = await findEmailsToUpdate();

  if (!emails || emails.length === 0) {
    logger.warn("[EMAILS] - No email to update");
    return true;
  }

  logger.warn(`[EMAILS] - ${emails.length} email(s) to update`);

  let cpt = 1;
  const emailsWithNoChange = [];

  for (const email of emails) {
    const body = await mgGetEvent(email.mailgunEmailId);

    let higherStatus = email.lastStatus;
    let statusUpdateDate = email.lastUpdate;

    logger.info(
      `➡️  ${email.emailData.to} : ${higherStatus} - ${cpt} / ${emails.length}`
    );
    // Update the counter
    cpt++;
    // Update date
    if (body.items.length) {
      for (const item of body.items) {
        const eventType = getEventType(item);

        if (
          MG_EVENT_STRING_SORTED.indexOf(eventType) >
          MG_EVENT_STRING_SORTED.indexOf(higherStatus)
        ) {
          statusUpdateDate = new Date(item.timestamp * 1000);
          higherStatus = eventType;
        }
      }

      if (higherStatus !== email.lastStatus) {
        logger.warn(
          `\t 📩 New info to synchro : ${higherStatus} > ${email.lastStatus}`
        );

        if (
          Object.values(CampaignEmailNameToSync).includes(
            email.emailType as CampaignEmailNameToSync
          )
        ) {
          await updateUser({ user_id: email.info.user_id }, {
            [`campaigns.${CAMPAIGN_DEFAULT_NAME}.lastEmailStatus`]:
              higherStatus,
          } as Partial<User>);

          PosthogClient.instance.capture({
            event: TRACKED_EVENTS.API_UPDATE_CAMPAIGN_EMAIL_STATUS,
            properties: {
              oldStatus: email.lastStatus,
              newStatus: higherStatus,
              email,
            },
          });
        }

        const statusValue = `status.${higherStatus}.value`;
        const statusDate = `status.${higherStatus}.date`;
        const dataToUpdate = {
          lastStatus: higherStatus,
          lastUpdate: new Date(),
          [statusDate]: statusUpdateDate,
          [statusValue]: true,
        };

        await updatOneEmailCampaign({ _id: email._id }, dataToUpdate);
      } else {
        emailsWithNoChange.push(email._id);
        logger.info(`\t ✌️ Nothing to send to ${email.emailData.to}...\n`);
      }
    } else {
      emailsWithNoChange.push(email._id);
    }
  }

  logger.info("[EMAILS] - Update only dates");

  await updateManyEmailCampaign(
    { _id: { $in: emailsWithNoChange } },
    { lastUpdate: new Date() }
  );

  return true;
};
