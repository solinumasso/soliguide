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
import mongoose from "mongoose";

import { AnyDepartmentCode, CampaignNameAndAll } from "@soliguide/common";

import { findEmailTemplates } from "../services/email-templates.service";

import {
  CONFIG,
  User,
  CampaignEmails,
  CampaignEmailTemplates,
  CampaignEmailName,
  EmailData,
  ModelWithId,
} from "../../_models";

const generateBaseCampaignEmail = (
  frontUrl: string,
  emailTemplate: CampaignEmailTemplates,
  emailType: CampaignEmailName,
  user: User,
  invitationToken: string,
  organization_id = -1
): EmailData => {
  if (!emailTemplate) {
    throw new Error("Email Template not found");
  }
  const emailToSend = emailTemplate.emails[emailType];

  if (!emailToSend) {
    throw new Error("Email to send not found");
  }

  const senderName = emailTemplate.senderName
    ? emailTemplate.senderName
    : "Solinum";

  const senderEmail = emailTemplate.senderEmail
    ? emailTemplate.senderEmail
    : CONFIG.DEFAULT_SENDER_EMAIL;

  // Base information
  const baseCampaignEmail: EmailData = {
    // Specify email data
    from: `${senderName} <${senderEmail}>`,
    html: "",
    // Subject and text data
    subject: emailToSend.subject,
    // The email to contact
    to: user.mail,
  };

  let content = emailToSend.content;

  content = content.replace(/%CAMPAIGN_NAME%/gm, emailTemplate.campaign);
  content = content.replace(/%EMAIL_TYPE%/gm, emailType);
  content = content.replace(/%USER_ID%/gm, user.user_id.toString());
  content = content.replace(
    /%EMAIL_SOLIGUIDE%/gm,
    `${emailTemplate.senderEmail}`
  );
  content = content.replace(/%NOM_SOLIGUIDE%/gm, emailTemplate.senderName);

  if (invitationToken) {
    // Registration link - signup
    const link = `${frontUrl}/fr/register/${invitationToken}`;
    // Link to the campaign
    content = content.replace(/https:\/\/lien_invitation/gm, link);
  }

  if (organization_id >= 0) {
    // Registration link- signup
    const link = `${frontUrl}/fr/organisations/${organization_id}`;
    // Link to the campaign
    content = content.replace(/https:\/\/lien_organisation/gm, link);
  }

  if (CONFIG.ENV !== "prod") {
    content = content.replace(/https:\/\/soliguide\.fr\//gm, frontUrl);
  }

  baseCampaignEmail.html = content;

  return baseCampaignEmail;
};

/**
 * @brief Generate an email for a user
 *  - the campaign name ;
 *  - the invitation token when relevant ;
 *  - the email type to generate
 *  - the territory ID
 *  - The territory to find the email template
 *  - the user for whom we want to generate this email
 * @param req
 * @param campaign
 * @param invitationToken
 * @param emailType
 * @param organization_id
 * @param territory
 * @param user
 */
const generateEmail = async (
  frontUrl: string,
  campaign: CampaignNameAndAll,
  invitationToken: string,
  emailType: CampaignEmailName,
  organization_id: number,
  territory: AnyDepartmentCode,
  user: User
): Promise<{ emailData: EmailData; template: CampaignEmailTemplates }> => {
  if (emailType.includes("INVITATION") && !invitationToken) {
    // No invitation given for an invitation email
    return Promise.reject(new Error(`'${emailType}' REQUIRED AN INVITATION`));
  }

  // 1. Search for the email template
  const template = (await findEmailTemplates({
    campaign,
    territory,
  })) as CampaignEmailTemplates;

  if (!template) {
    // Outside departments covered by Solinum
    return Promise.reject(new Error(`TEMPLATE '${emailType}' NOT FOUND`));
  }

  // 2. Generate the email from the template
  const emailData = generateBaseCampaignEmail(
    frontUrl,
    template,
    emailType,
    user,
    invitationToken,
    organization_id
  );

  return { emailData, template };
};

export const createEmail = async (
  frontUrl: string,
  campaign: CampaignNameAndAll,
  invitationToken: string,
  emailType: CampaignEmailName,
  organization: mongoose.Types.ObjectId | any,
  organization_id: number,
  territory: AnyDepartmentCode,
  user: ModelWithId<User>
): Promise<Partial<CampaignEmails>> => {
  let generatedEmail;
  try {
    generatedEmail = await generateEmail(
      frontUrl,
      campaign,
      invitationToken,
      emailType,
      organization_id,
      territory,
      user
    );
  } catch (e) {
    return Promise.reject(e);
  }

  const emailData = generatedEmail.emailData;
  const template = generatedEmail.template;

  return {
    campaign,
    info: {
      // Related organization
      organization,
      organization_id,
      // Related territory
      territory,
      // User associated to the email
      user: user._id,
      user_id: user.user_id,
    },
    emailData,
    emailType,
    recipientEmail: emailData.to,
    senderEmail: template.senderEmail
      ? template.senderEmail
      : "contact@solinum.org",
  };
};
