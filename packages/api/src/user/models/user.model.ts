import mongoose from "mongoose";

import {
  ALL_DEPARTMENT_CODES,
  Categories,
  UserStatus,
} from "@soliguide/common";

import { User } from "../../_models/users";
import { languagesValidator } from "./validators";
import { PhoneSchema } from "../../place/models";

const UserSchema = new mongoose.Schema<User>(
  {
    areas: {
      type: Object,
    },

    // Developers blocking
    blocked: {
      default: false,
      type: Boolean,
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
    lastLogin: {
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
