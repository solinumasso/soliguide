import mongoose from "mongoose";

import { ApiTranslatedPlace } from "../interfaces";
import { PositionForTranslationSchema } from "./subschemas/positionForTranslation.model";
import { SUPPORTED_LANGUAGES } from "@soliguide/common";

const TranslatedPlaceSchema = new mongoose.Schema<ApiTranslatedPlace>(
  {
    sourceLanguage: {
      type: String,
      enum: [...SUPPORTED_LANGUAGES],
      required: true,
    },

    languages: {
      type: Object,
      default: {},
      required: true,
    },
    lastUpdate: { default: Date.now(), type: Date },
    lieu_id: { index: true, unique: true, type: Number },
    placeObjectId: {
      ref: "Place",
      type: mongoose.Schema.Types.ObjectId,
    },
    position: {
      type: PositionForTranslationSchema,
    },
    // Translation rate, all languages combined
    translationRate: {
      default: 0,
      type: Number,
      index: true,
    },
  },
  {
    strict: true,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

TranslatedPlaceSchema.index({ createdAt: 1, updatedAt: 1 });
TranslatedPlaceSchema.virtual("place", {
  ref: "Place",
  localField: "placeObjectId",
  foreignField: "_id",
  justOne: true,
});

export const TranslatedPlaceModel = mongoose.model(
  "TranslatedPlace",
  TranslatedPlaceSchema,
  "translatedPlaces"
);
