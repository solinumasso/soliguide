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
import { USER_ROLES } from "../constants/USER_ROLES.const";

import { ALL_DEPARTMENT_CODES } from "@soliguide/common";
import { InvitationPopulate } from "../interfaces";

const InvitationSchema = new mongoose.Schema<InvitationPopulate>(
  {
    acceptedAt: {
      default: null,
      type: Date,
    },

    createdBy: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },

    organization: {
      ref: "Organization",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },

    organizationName: { type: String },

    // Id as a number
    organization_id: { required: true, type: Number },

    // Invitation still pending
    pending: { default: true, type: Boolean },

    roleType: { enum: USER_ROLES, required: true, type: String },

    territories: {
      default: [],
      type: [String],
      enum: ALL_DEPARTMENT_CODES,
    },

    token: { default: null, nullable: true, type: String, unique: true },

    user: {
      ref: "User",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    // ID as a number
    user_id: { required: true, type: Number },
  },
  {
    strict: true,
    timestamps: true,
  }
);

InvitationSchema.index(
  { createdAt: 1, updatedAt: 1, "user._id": 1 },
  { sparse: true }
);

InvitationSchema.index({ organization_id: 1, user_id: 1 }, { unique: true });

export const InvitationModel = mongoose.model(
  "Invitation",
  InvitationSchema,
  "invitations"
);
