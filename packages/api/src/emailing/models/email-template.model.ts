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

import { ALL_DEPARTMENT_CODES, CAMPAIGN_DEFAULT_NAME } from "@soliguide/common";

import { EmailTemplateContentSchema } from "./subschemas/email-template-content.model";

import { CampaignEmailTemplates, CAMPAIGN_EMAILS_CONTENT } from "../../_models";

const EmailTemplateSchema: mongoose.Schema<CampaignEmailTemplates> =
  new mongoose.Schema(
    {
      // Campaign name
      campaign: { default: CAMPAIGN_DEFAULT_NAME, type: String },
      confirm: { default: false, type: Boolean },
      confirmDate: { default: null, type: Date },
      emails: {
        default: CAMPAIGN_EMAILS_CONTENT[CAMPAIGN_DEFAULT_NAME],
        type: {
          CAMPAGNE_COMPTES_PRO: EmailTemplateContentSchema,
          CAMPAGNE_INVITATIONS: EmailTemplateContentSchema,
          RELANCE_CAMPAGNE_COMPTES_PRO: EmailTemplateContentSchema,
          RELANCE_CAMPAGNE_INVITATIONS: EmailTemplateContentSchema,
          RELANCE_DESESPOIR_COMPTES_PRO: EmailTemplateContentSchema,
          RELANCE_DESESPOIR_INVITATIONS: EmailTemplateContentSchema,
          RELANCE_TERMINER_MAJ: EmailTemplateContentSchema,
          REMIND_ME: EmailTemplateContentSchema,
        },
      },

      // Sender name
      senderEmail: { default: null, type: String },

      // Territory sender email
      senderName: { default: null, type: String },

      // Related territory
      territory: { required: true, enum: ALL_DEPARTMENT_CODES, type: String },
    },
    {
      collection: "emailsTemplates",
      strict: true,
      timestamps: true,
    }
  );

export default mongoose.model("EmailTemplateSchema", EmailTemplateSchema);
