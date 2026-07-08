import { Schema, model } from "mongoose";

import {
  CAMPAIGN_SECTION_PATHS,
  CampaignLifecycleStatus,
  SOLIGUIDE_COUNTRIES,
  STRUCTURE_TYPES,
  type Campaign,
} from "@soliguide/common";

const SLUG_REGEX = /^[a-z0-9-]+$/;

export const CampaignSchema = new Schema<Campaign>(
  {
    slug: {
      required: true,
      type: String,
      unique: true,
      trim: true,
      validate: {
        validator: (value: string) => SLUG_REGEX.test(value),
        message: "slug must match /^[a-z0-9-]+$/",
      },
    },

    name: { required: true, trim: true, type: String },
    description: { default: null, trim: true, type: String },

    status: {
      default: CampaignLifecycleStatus.DRAFT,
      enum: CampaignLifecycleStatus,
      index: true,
      required: true,
      type: String,
    },

    country: {
      enum: SOLIGUIDE_COUNTRIES,
      index: true,
      required: true,
      type: String,
    },

    territories: {
      default: [],
      type: [String],
    },

    structureTypes: {
      default: [],
      type: [String],
      enum: STRUCTURE_TYPES,
    },

    sectionsToUpdate: {
      default: [],
      type: [String],
      enum: CAMPAIGN_SECTION_PATHS,
    },

    startDate: { required: true, type: Date },
    endDate: { required: true, type: Date },
  },
  { strict: true, timestamps: true }
);

CampaignSchema.pre("validate", function (next) {
  if (this.startDate && this.endDate && this.endDate <= this.startDate) {
    return next(new Error("campaign.endDate must be strictly after startDate"));
  }
  return next();
});

// Recherche des campagnes ACTIVE par pays (matérialisation, ciblage email).
CampaignSchema.index({ country: 1, status: 1 });

export const CampaignModel = model<Campaign>(
  "Campaign",
  CampaignSchema,
  "campaigns"
);
