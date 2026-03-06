import mongoose from "mongoose";
import { USER_ROLES } from "../constants/USER_ROLES.const";
import { InvitationPopulate } from "../../_models";
import { ALL_DEPARTMENT_CODES } from "@soliguide/common";

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
