import mongoose from "mongoose";

import { USER_ROLES } from "../constants/USER_ROLES.const";

import type { UserRight } from "../../_models";
import { UserRightStatus } from "@soliguide/common";

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
