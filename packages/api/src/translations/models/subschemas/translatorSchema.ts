import mongoose from "mongoose";

import { TranslatedFieldLanguageStatus } from "@soliguide/common";

import { ApiTranslatedFieldTranslatorSchema } from "../../interfaces/ApiTranslatedFieldTranslatorSchema.interface";

export const translatorSchema =
  new mongoose.Schema<ApiTranslatedFieldTranslatorSchema>(
    {
      content: { default: null, type: String },
      status: {
        enum: TranslatedFieldLanguageStatus,
        type: String,
      },
      translator: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        default: null,
      },
      translatorName: { default: null, type: String },
    },
    { strict: true, timestamps: true, _id: false }
  );
