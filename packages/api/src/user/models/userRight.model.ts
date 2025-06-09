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
import { UserRightStatus } from "@soliguide/common";
import { USER_ROLES } from "../constants";
import { UserRight } from "../interfaces";

const UserRightSchema = new mongoose.Schema<UserRight>(
  {
    displayContactPro: { default: false, type: Boolean },
    organization: {
      ref: "Organization",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    organization_id: { required: true, type: Number },
    // ! Information : special case, may be null if no place defined in the organization
    place: {
      default: null,
      ref: "Place",
      type: mongoose.Schema.Types.ObjectId,
    },
    place_id: { default: null, type: Number },
    role: { enum: USER_ROLES, required: true, type: String, index: true },
    status: {
      default: UserRightStatus.PENDING,
      enum: UserRightStatus,
      required: true,
      type: String,
    },
    user: { ref: "User", required: true, type: mongoose.Schema.Types.ObjectId },
    user_id: { required: true, type: Number },
  },
  {
    strict: true,
    timestamps: true,
  }
);

UserRightSchema.index(
  { createdAt: 1, updatedAt: 1, role: 1 },
  { sparse: true }
);

UserRightSchema.index(
  { organization_id: 1, place_id: 1, user_id: 1 },
  { unique: true }
);

export const UserRightModel = mongoose.model(
  "UserRight",
  UserRightSchema,
  "userRights"
);
