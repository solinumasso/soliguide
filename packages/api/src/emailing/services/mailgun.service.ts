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
import formData from "form-data";

import Mailgun, { MailgunMessageData, MessagesSendResult } from "mailgun.js";
import type { Logger } from "pino";

import { CONFIG, EMAILS_FOR_TESTS, EmailCallToActionData } from "../../_models";

const mailgun = new Mailgun(formData).client({
  key: CONFIG.MAILGUN_API_KEY,
  username: "api",
});

const redirectingAddress = (isCampaign: boolean): string => {
  if (isCampaign) {
    const random = Math.floor(Math.random() * EMAILS_FOR_TESTS.length);
    return EMAILS_FOR_TESTS[random];
  } else {
    return CONFIG.TEST_RECIPIENT_EMAIL;
  }
};

const sendEmail = async (
  mailgunData: MailgunMessageData,
  logger: Logger,
  isCampaign = false
): Promise<MessagesSendResult> => {
  mailgunData.to =
    CONFIG.ENV !== "prod" ? redirectingAddress(isCampaign) : mailgunData.to;

  if (mailgunData.cc) {
    mailgunData.cc =
      CONFIG.ENV !== "prod" ? redirectingAddress(isCampaign) : mailgunData.cc;
  }

  logger.warn(`ENVOI EN COURS À : ${mailgunData.to}`);

  return await mailgun.messages.create(CONFIG.EMAIL_FROM_DOMAIN, mailgunData);
};

export const mgSendTemplateEmail = async (
  {
    params,
    recipientEmail,
    replyEmail,
    senderEmail,
    subject,
    templateName,
  }: EmailCallToActionData,
  logger: Logger
): Promise<MessagesSendResult> => {
  const mailgunData: MailgunMessageData = {
    from: senderEmail,
    "h:Reply-To": replyEmail,
    "h:X-Mailgun-Variables": JSON.stringify(params),
    subject,
    template: templateName ? templateName : "",
    to: recipientEmail,
  };

  return await sendEmail(mailgunData, logger);
};

export const mgSendHtmlEmail = async (
  {
    cc,
    html,
    isCampaign,
    recipientEmail,
    senderEmail,
    subject,
  }: EmailCallToActionData,
  logger: Logger
): Promise<MessagesSendResult> => {
  const mailgunData: MailgunMessageData = {
    from: senderEmail,
    html: html ? html : "",
    subject,
    to: recipientEmail,
  };

  if (cc) {
    mailgunData.cc = cc;
  }

  return await sendEmail(mailgunData, logger, isCampaign);
};
