import {
  ALL_DEPARTMENT_CODES,
  CountryCodes,
  PlaceChangesSection,
  PlaceChangesStatus,
  PlaceType,
} from "@soliguide/common";

import mongoose, { Schema, model } from "mongoose";

import { UserForLogsSchema } from "../../logging/models/subschemas/user-for-logs.schema";
import { PlaceChanges } from "../interfaces/PlaceChanges.interface";

// Store the change log
const PlaceChangesSchema = new Schema<PlaceChanges>(
  {
    // Update by the bof
    automation: {
      default: false,
      type: Boolean,
    },

    // Peut être :
    //  - une valeur `CampaignName` (crisis campaigns historiques),
    //  - un `slug` de campagne (nouveau modèle, collection `campaigns`),
    //  - `null` si le changement n'est pas lié à une campagne.
    // Contrainte `enum` retirée : le champ accepte désormais les slugs
    // arbitraires. Validation à la source (schéma `campaigns.slug` regex).
    campaignName: {
      default: null,
      index: true,
      trim: true,
      type: String,
    },

    isCampaign: {
      default: false,
      required: true,
      type: Boolean,
      index: true,
    },

    lieu_id: {
      required: true,
      index: true,
      type: Number,
    },

    new: {
      default: null,
      type: Object,
    },

    noChanges: {
      default: false,
      type: Boolean,
    },

    old: {
      default: null,
      type: Object,
    },

    place: {
      ref: "Place",
      type: mongoose.Schema.Types.ObjectId,
    },

    placeOnline: {
      default: true,
      required: true,
      type: Boolean,
    },

    placeType: {
      default: PlaceType.PLACE,
      enum: PlaceType,
      required: true,
      index: true,
      type: String,
    },

    // Edited form sections
    section: {
      index: true,
      enum: PlaceChangesSection,
      required: true,
      type: String,
    },

    status: {
      index: true,
      default: PlaceChangesStatus.NOT_EVALUATED,
      enum: PlaceChangesStatus,
      type: String,
    },

    territory: {
      index: true,
      default: null,
      enum: [...ALL_DEPARTMENT_CODES, null],
      type: String,
    },
    country: {
      default: null,
      enum: [...Object.values(CountryCodes), null],
      type: String,
    },

    userData: {
      type: UserForLogsSchema,
    },
  },
  {
    collection: "placeChanges",
    strict: true,
    timestamps: true,
  }
);

PlaceChangesSchema.index({ createdAt: 1, updatedAt: 1 });

export const PlaceChangesModel = model<PlaceChanges>(
  "PlaceChanges",
  PlaceChangesSchema
);
