import { ObjectId } from "mongodb";
import mongoose, { Schema, model } from "mongoose";

import { TempInfoType, TempInfoStatus } from "@soliguide/common";

import { OpeningHoursSchema } from "../../place/models";
import type { TempInfo } from "../types";

const TempInfoSchema = new Schema<TempInfo>(
  {
    dateDebut: { required: true, type: Date },

    dateFin: { default: null, type: Date },

    description: { default: null, trim: true, type: String },

    hours: { default: null, type: OpeningHoursSchema },

    name: { default: null, trim: true, type: String },

    // Number of days this info is valid
    nbDays: { default: null, type: Number },

    place: {
      ref: "Place",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    placeId: { required: true, type: Number },

    // Service ObjectID if this info is linked to a service
    serviceObjectId: { default: null, type: ObjectId },

    status: {
      default: TempInfoStatus.FUTURE,
      enum: TempInfoStatus,
      required: true,
      type: String,
    },

    tempInfoType: {
      enum: TempInfoType,
      required: true,
      type: String,
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);

TempInfoSchema.index(
  {
    dateDebut: 1,
    placeId: 1,
    serviceObjectId: 1,
    tempInfoType: 1,
  },
  { unique: true }
);

export const TempInfoModel = model("TempInfo", TempInfoSchema, "tempInfos");
