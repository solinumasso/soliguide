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
  SUPPORTED_LANGUAGES,
  SupportedLanguagesCode,
  UserStatusNotLogged,
} from "@soliguide/common";

import { Schema } from "mongoose";
import {
  USER_ROLES_FOR_LOGS,
  USER_STATUS_FOR_LOGS,
} from "../../../user/constants";
import { Origin } from "../../../_models/users/enums";
import { UserForLogs } from "../../../user/interfaces";

export const UserForLogsSchema = new Schema<UserForLogs>(
  {
    email: {
      index: true,
      default: null,
      lowercase: true,
      trim: true,
      type: String,
    },

    // Browser language
    language: {
      default: SupportedLanguagesCode.FR,
      enum: SUPPORTED_LANGUAGES,
      required: true,
      type: String,
    },

    // ID in number, not an ObjectID
    orgaId: { index: true, default: null, type: Number },

    orgaName: { index: true, default: null, trim: true, type: String },

    origin: {
      default: Origin.ORIGIN_UNDEFINED,
      enum: Origin,
      trim: true,
      type: String,
    },
    referrer: { default: null, type: String },

    // User role
    role: {
      default: null,
      enum: USER_ROLES_FOR_LOGS,
      type: String,
    },

    // User status
    status: {
      index: true,
      default: UserStatusNotLogged.NOT_LOGGED,
      enum: USER_STATUS_FOR_LOGS,
      required: true,
      trim: true,
      type: String,
    },
    // Place's territory
    territory: {
      enum: [...ALL_DEPARTMENT_CODES, null],
      default: null,
      type: String,
    },

    userName: { default: "", trim: true, type: String },

    user_id: { default: null, type: Number },
  },
  {
    strict: true,
    _id: false,
  }
);
