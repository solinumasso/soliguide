import {
  CampaignPlaceAutonomy,
  CampaignSource,
  CampaignStatus,
} from "@soliguide/common";

import { Schema } from "mongoose";

import { ApiPlaceUpdateCampaign } from "../interfaces";

export const PlaceUpdateCampaignSchema = new Schema<ApiPlaceUpdateCampaign>(
  {
    // Autonomy level
    autonomy: {
      default: CampaignPlaceAutonomy.UNKNOWN,
      enum: CampaignPlaceAutonomy,
      trim: true,
      type: String,
      uppercase: true,
    },

    // Form current step
    currentStep: { default: 0, type: Number },

    // Form status (completed or not, starting date, etc.)
    general: {
      changes: { default: false, type: Boolean },
      endDate: { default: null, type: Date },
      startDate: { default: null, type: Date },
      updated: { default: false, type: Boolean },
    },

    // Reminder
    remindMeDate: { default: null, type: Date },

    // Change details
    sections: {
      tempClosure: {
        changes: { default: false, type: Boolean },
        date: { default: null, type: Date },
        updated: { default: false, type: Boolean },
      },
      hours: {
        changes: { default: false, type: Boolean },
        date: { default: null, type: Date },
        updated: { default: false, type: Boolean },
      },
      services: {
        changes: { default: false, type: Boolean },
        date: { default: null, type: Date },
        updated: { default: false, type: Boolean },
      },
      tempMessage: {
        changes: { default: false, type: Boolean },
        date: { default: null, type: Date },
        updated: { default: false, type: Boolean },
      },
    },

    // Update source
    source: {
      default: null,
      enum: [...Object.values(CampaignSource), null],
      type: String,
    },

    // Update status
    status: {
      default: CampaignStatus.TO_DO,
      enum: CampaignStatus,
      type: String,
    },

    // Whether the place has to be updated during this campaign
    toUpdate: { default: false, required: true, type: Boolean },
  },
  { _id: false }
);
