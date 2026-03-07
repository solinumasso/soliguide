import mongoose from "mongoose";
import {
  CommonPositionForTranslation,
  SOLIGUIDE_COUNTRIES,
} from "@soliguide/common";

export const PositionForTranslationSchema =
  new mongoose.Schema<CommonPositionForTranslation>({
    country: {
      trim: true,
      type: String,
      enum: [...SOLIGUIDE_COUNTRIES],
      uppercase: false,
    },
    regionCode: {
      trim: true,
      type: String,
      uppercase: true,
    },
    departmentCode: {
      index: true,
      type: String,
      uppercase: true,
    },
  });
