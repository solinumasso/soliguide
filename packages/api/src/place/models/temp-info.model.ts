import mongoose from "mongoose";

import type { PlaceTempInfo } from "@soliguide/common";

import { OpeningHoursSchema } from "./opening-hours.model";
import { SubSchemaId } from "../../_models";

const tempInfoDefaultSubSchema = {
  actif: {
    default: false,
    type: Boolean,
  },
  dateDebut: {
    default: null,
    type: Date,
  },
  dateFin: {
    default: null,
    type: Date,
  },
  description: {
    default: "",
    trim: true,
    type: String,
  },
};

export const TempInfoSchema = new mongoose.Schema<SubSchemaId<PlaceTempInfo>>(
  {
    closure: tempInfoDefaultSubSchema,
    hours: {
      ...tempInfoDefaultSubSchema,
      hours: {
        default: null,
        type: OpeningHoursSchema,
      },
    },
    message: {
      ...tempInfoDefaultSubSchema,
      name: {
        default: "",
        trim: true,
        type: String,
      },
    },
  },
  {
    strict: true,
    _id: false,
  }
);
