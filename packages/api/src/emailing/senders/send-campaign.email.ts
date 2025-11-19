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
import { subMinutes } from "date-fns";
import type { Logger } from "pino";

import { CAMPAIGN_DEFAULT_NAME, CAMPAIGN_LIST } from "@soliguide/common";

import {
  countEmailsManage,
  findEmails,
  updatOneEmailCampaign,
} from "../services/email-campaign.service";

import {
  CONFIG,
  type EmailCallToActionData,
  EmailEvents,
  LIMIT_NUM_EMAILS_TO_SEND,
} from "../../_models";

import { logger as defaultLogger } from "../../general/logger";

import { createLogEmail } from "../../logging/services/log-email.service";
import { mgSendHtmlEmail } from "../services/mailgun.service";
import { updateUser } from "../../user/services";
import { PosthogClient } from "../../analytics/services";
import { TRACKED_EVENTS } from "../../analytics/constants";

export const sendCampaignEmails = async (
  typeEmail = "campaign",
  limit = 100,
  logger: Logger = defaultLogger
) => {
  if (CONFIG.ENV !== "prod") {
    const nLastSentEmails = await countEmailsManage({
      lastStatus: { $ne: EmailEvents.TO_SEND },
      lastUpdate: { $gt: subMinutes(new Date(), 40) },
    });

    if (nLastSentEmails >= LIMIT_NUM_EMAILS_TO_SEND) {
      logger.warn(
        "[EMAILS] The maximum number of email has already been sent - No new email sent"
      );
      return true;
    }
  }

  const request: Record<string, any> = {
    "info.territory": {
      $in: CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].territories,
    },
    lastStatus: EmailEvents.TO_SEND,
  };

  if (typeEmail === "campaign") {
    request.emailType = { $ne: "REMIND_ME" };
  } else {
    request.emailType = typeEmail;
  }

  const emailsToSend = await findEmails(request, {
    limit,
    page: 1,
    skip: 0,
    sort: { createdAt: -1 },
  });

  logger.info(`[EMAILS] ${emailsToSend.length} emails to send`);

  for (const email of emailsToSend) {
    try {
      const emailData: EmailCallToActionData = {
        cc: email.emailData.cc,
        html: email.emailData.html,
        isCampaign: true,
        recipientEmail: email.emailData.to,
        senderEmail: email.emailData.from,
        subject: email.emailData.subject,
      };

      const result = await mgSendHtmlEmail(emailData, logger);

      PosthogClient.instance.capture({
        event: TRACKED_EVENTS.API_SEND_CAMPAIGN_EMAIL,
        properties: {
          typeEmail,
          emailData,
          status: typeof result === "object" ? "SUCCESS" : "FAIL",
        },
      });

      let status = null;
      let mailgunEmailId = null;

      if (typeof result !== "object") {
        status = "FAIL";
        mailgunEmailId = null;

        // In case of a failure
        await updatOneEmailCampaign(
          { _id: email._id },
          {
            lastStatus: EmailEvents.SEND_FAILED,
            lastUpdate: new Date(),
            mailgunEmailId,
          }
        );
      } else {
        status = "SUCCESS";
        mailgunEmailId = result.id ? result.id.replace(/(<|>)/gm, "") : "";

        // Email status update
        await updatOneEmailCampaign(
          { _id: email._id },
          {
            lastStatus: EmailEvents.SENT,
            lastUpdate: new Date(),
            mailgunEmailId,
            "status.PENDING.date": new Date(),
            "status.PENDING.value": true,
          }
        );
      }

      await createLogEmail(
        mailgunEmailId,
        email._id.toString(),
        JSON.stringify(result),
        status
      );

      await updateUser(
        { user_id: email.info.user_id },
        {
          [`campaigns.${CAMPAIGN_DEFAULT_NAME}.${email.emailType}.done`]: true,
          [`campaigns.${CAMPAIGN_DEFAULT_NAME}.${email.emailType}.sendDate`]:
            new Date(),
        },
        undefined,
        false
      );
    } catch (e) {
      logger.error(e, `SEND_${email.emailType}`);

      // Update to indicate the email causing an error
      await createLogEmail(
        null,
        email._id.toString(),
        typeof e === "object" ? JSON.stringify(e) : e,
        "ERROR"
      );
    }
  }

  return true;
};
