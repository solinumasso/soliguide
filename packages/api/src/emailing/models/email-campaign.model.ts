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
  ALL_DEPARTMENT_CODES,
  AllCampaign,
  CAMPAIGN_DEFAULT_NAME,
  CampaignName,
} from "@soliguide/common";

import mongoose from "mongoose";

import {
  CampaignEmailNameToSync,
  CampaignEmailRemindMe,
  CampaignEmails,
  EmailEvents,
} from "../../_models";

const EmailsCampaignSchema: mongoose.Schema<CampaignEmails> =
  new mongoose.Schema(
    {
      campaign: {
        default: CAMPAIGN_DEFAULT_NAME,
        type: String,
        enum: [...Object.values(CampaignName), ...Object.values(AllCampaign)],
      },

      // Stats info
      info: {
        // Related organization
        organization: {
          ref: "Organization",
          required: true,
          type: mongoose.Schema.Types.ObjectId,
        },
        organization_id: { required: true, type: Number },

        // Related places
        places: [{ ref: "Place", type: mongoose.Schema.Types.ObjectId }],
        placesId: { default: [], type: [Number] },

        territory: { enum: ALL_DEPARTMENT_CODES, required: true, type: String },

        // User related to the email
        user: {
          ref: "User",
          required: true,
          type: mongoose.Schema.Types.ObjectId,
        },
        user_id: { required: true, type: Number },
      },

      // Last email status
      lastStatus: {
        default: EmailEvents.TO_SEND,
        enum: EmailEvents,
        required: true,
        type: String,
      },

      // Last update date from WebHook or Events
      lastUpdate: { default: null, type: Date },

      emailData: {
        cc: { type: String },
        from: { required: true, type: String },
        html: { required: true, type: String },
        subject: { required: true, type: String },
        to: { required: true, type: String },
      },

      // Mailgun email ID
      mailgunEmailId: { default: null, type: String },

      emailType: {
        enum: [
          ...Object.values(CampaignEmailNameToSync),
          ...Object.values(CampaignEmailRemindMe),
        ],
        required: true,
        type: String,
      },

      recipientEmail: { lowercase: true, required: true, type: String },

      // e.g. gironde@solinum.org, etc
      senderEmail: { lowercase: true, required: true, type: String },

      // Status history
      status: {
        BOUNCED_PERM: {
          date: { default: null, type: Date },
          value: { default: false, type: Boolean },
        },
        BOUNCED_TEMP: {
          date: { default: null, type: Date },
          value: { default: false, type: Boolean },
        },
        CLICKED: {
          date: { default: null, type: Date },
          value: { default: false, type: Boolean },
        },
        DELIVERED: {
          date: { default: null, type: Date },
          value: { default: false, type: Boolean },
        },
        HUMAN_RESPONSE: {
          date: { default: null, type: Date },
          value: { default: false, type: Boolean },
        },
        OPENED: {
          date: { default: null, type: Date },
          value: { default: false, type: Boolean },
        },
        // Pending Mailgun processing
        PENDING: {
          date: { default: null, type: Date },
          value: { default: false, type: Boolean },
        },
        // Rejected by Mailgun
        REJECTED: {
          date: { default: null, type: Date },
          value: { default: false, type: Boolean },
        },

        // Sent the
        SENT: {
          date: { default: null, type: Date },
          value: { default: false, type: Boolean },
        },
        SPAM: {
          date: { default: null, type: Date },
          value: { default: false, type: Boolean },
        },
        // Dispatch date
        TO_SEND: {
          date: { default: null, type: Date },
          value: { default: true, type: Boolean },
        },
      },
    },
    {
      collection: "emailsCampaign",
      strict: true,
      timestamps: true,
    }
  );

export default mongoose.model("emailsCampaign", EmailsCampaignSchema);
