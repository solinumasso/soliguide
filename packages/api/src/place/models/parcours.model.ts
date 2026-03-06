import mongoose from "mongoose";
import { OpeningHoursSchema } from "./opening-hours.model";
import { PositionSchema } from "./position.model";
import { CommonOpeningHours } from "@soliguide/common";

export const ParcoursSchema = new mongoose.Schema(
  {
    description: {
      default: null,
      trim: true,
      type: String,
    },

    hours: {
      default: new CommonOpeningHours(),
      type: OpeningHoursSchema,
    },

    // Wiser to have pictures for each checkpoint rather than globally
    photos: {
      default: [],
      ref: "Photos",
      type: [mongoose.Schema.Types.ObjectId],
    },

    position: {
      default: null,
      required: true,
      type: PositionSchema,
    },
  },
  { strict: true, _id: false }
);
