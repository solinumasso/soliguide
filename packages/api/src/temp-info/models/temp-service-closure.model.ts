import mongoose from "mongoose";

import type { TempServiceClosure } from "../interfaces";

// Collection to gather temporary closures planned on services
const TempServiceClosureSchema = new mongoose.Schema<TempServiceClosure>(
  {
    startDate: { required: true, type: Date },
    endDate: { default: null, type: Date },
    nbDays: { default: null, type: Number },
    place: { required: true, type: mongoose.Schema.Types.ObjectId },
    serviceObjectId: { required: true, type: mongoose.Schema.Types.ObjectId },
    campaign: { default: null, type: String },
  },
  { strict: true, timestamps: true }
);

TempServiceClosureSchema.index(
  { serviceObjectId: 1, startDate: 1 },
  { unique: true }
);

export const TempServiceClosureModel = mongoose.model<TempServiceClosure>(
  "TempServiceClosure",
  TempServiceClosureSchema,
  "tempServiceClosures"
);
