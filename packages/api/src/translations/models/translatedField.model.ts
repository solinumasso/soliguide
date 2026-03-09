import { SUPPORTED_LANGUAGES, TranslatedFieldStatus } from "@soliguide/common";

import mongoose from "mongoose";

import { ALL_FIELDS_TO_TRANSLATE } from "../constants";

import { ApiTranslatedField } from "../interfaces";
import { PositionForTranslationSchema } from "./subschemas/positionForTranslation.model";

const TranslatedFieldSchema = new mongoose.Schema<ApiTranslatedField>(
  {
    content: {
      default: null,
      required: true,
      type: String,
    },
    elementName: {
      enum: ALL_FIELDS_TO_TRANSLATE,
      required: true,
      type: String,
      index: true,
    },
    sourceLanguage: {
      type: String,
      required: true,
      enum: [...SUPPORTED_LANGUAGES],
    },
    languages: {
      type: Object,
      default: {},
      required: true,
    },
    lieu_id: {
      index: true,
      required: true,
      type: Number,
    },
    placeObjectId: {
      ref: "Place",
      type: mongoose.Schema.Types.ObjectId,
    },
    position: {
      type: PositionForTranslationSchema,
    },
    serviceObjectId: {
      default: null,
      index: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      default: TranslatedFieldStatus.NEED_AUTO_TRANSLATE,
      enum: TranslatedFieldStatus,
      required: true,
      type: String,
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

TranslatedFieldSchema.index({ createdAt: 1, updatedAt: 1 });

TranslatedFieldSchema.virtual("place", {
  ref: "Place",
  localField: "placeObjectId",
  foreignField: "_id",
  justOne: true,
});

export const TranslatedFieldModel = mongoose.model(
  "TranslatedField",
  TranslatedFieldSchema,
  "translatedFields"
);
