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

import {
  ALL_DEPARTMENT_CODES,
  Categories,
  UserStatus,
} from "@soliguide/common";

import { CampaignEmailsSchema } from "./campaignEmails.model";
import { User } from "../../_models/users";
import {
  AirtableSyncSchema,
  AIRTABLE_SYNC_DEFAULT_USER,
} from "../../airtable/models/airtableSync.model";
import { CAMPAIGN_EMAILS_CONTENT_FOR_USERS } from "./default_values";
import { languagesValidator } from "./validators";
import { PhoneSchema } from "../../place/models";

const UserSchema = new mongoose.Schema<User>(
  {
    areas: {
      type: Object,
    },
    atSync: {
      default: AIRTABLE_SYNC_DEFAULT_USER,
      required: true,
      type: AirtableSyncSchema,
    },

    // Developers blocking
    blocked: {
      default: false,
      type: Boolean,
    },

    campaigns: {
      MAJ_ETE_2022: {
        default: CAMPAIGN_EMAILS_CONTENT_FOR_USERS,
        type: CampaignEmailsSchema,
      },

      MAJ_ETE_2023: {
        default: CAMPAIGN_EMAILS_CONTENT_FOR_USERS,
        type: CampaignEmailsSchema,
      },

      MAJ_ETE_2024: {
        default: CAMPAIGN_EMAILS_CONTENT_FOR_USERS,
        type: CampaignEmailsSchema,
      },

      MAJ_HIVER_2022: {
        default: CAMPAIGN_EMAILS_CONTENT_FOR_USERS,
        type: CampaignEmailsSchema,
      },

      MAJ_HIVER_2023: {
        default: CAMPAIGN_EMAILS_CONTENT_FOR_USERS,
        type: CampaignEmailsSchema,
      },

      END_YEAR_2024: {
        default: CAMPAIGN_EMAILS_CONTENT_FOR_USERS,
        type: CampaignEmailsSchema,
      },

      MID_YEAR_2025: {
        default: CAMPAIGN_EMAILS_CONTENT_FOR_USERS,
        type: CampaignEmailsSchema,
      },

      UKRAINE_2022: {
        default: CAMPAIGN_EMAILS_CONTENT_FOR_USERS,
        type: CampaignEmailsSchema,
      },
    },

    // Restrictions for API users
    categoriesLimitations: { enum: Categories, default: [], type: [String] },

    // Token for API user
    devToken: { default: null, type: String },
    invitations: [
      {
        ref: "Invitation",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],

    languages: {
      default: [],
      type: [String],
      required: false,
      validate: languagesValidator,
    },

    lastname: {
      required: true,
      trim: true,
      index: true,
      type: String,
    },

    mail: {
      index: true,
      lowercase: true,
      required: true,
      trim: true,
      type: String,
      unique: true,
    },

    // First name
    name: {
      required: true,
      trim: true,
      index: true,
      type: String,
    },

    // List of organizations to which I'm a member
    organizations: [
      {
        ref: "Organization",
        type: mongoose.Schema.Types.ObjectId,
      },
    ],

    password: {
      required: true,
      trim: true,
      select: false,
      type: String,
    },
    passwordToken: { default: null, type: String, select: false },
    phone: { default: null, type: PhoneSchema },
    selectedOrgaIndex: { default: 0, type: Number },

    status: {
      index: true,
      default: UserStatus.SIMPLE_USER,
      enum: UserStatus,
      type: String,
    },

    // @deprecated
    territories: {
      default: [],
      type: [String],
      enum: ALL_DEPARTMENT_CODES,
    },

    title: { default: null, trim: true, type: String },
    translator: {
      default: false,
      required: false,
      type: Boolean,
    },

    // user_id as a number to ease the integration with Airtable
    user_id: {
      index: true,
      required: true,
      type: Number,
      unique: true,
    },

    // Account humanely validated by email
    verified: {
      index: true,
      default: false,
      type: Boolean,
    },

    // When the account has been verified, and therefore completely created
    verifiedAt: {
      default: null,
      type: Date,
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);

UserSchema.index({ createdAt: 1, updatedAt: 1 });
export const UserModel = mongoose.model<User>("User", UserSchema, "users");
