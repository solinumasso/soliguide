import {
  ALL_DEPARTMENT_CODES,
  SUPPORTED_LANGUAGES,
  SupportedLanguagesCode,
  UserStatusNotLogged,
} from "@soliguide/common";

import { Schema } from "mongoose";

import { UserForLogs, Origin } from "../../../_models/users";

import { USER_ROLES_FOR_LOGS } from "../../../user/constants/USER_ROLES.const";
import { USER_STATUS_FOR_LOGS } from "../../../user/constants/USER_STATUS.const";

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
