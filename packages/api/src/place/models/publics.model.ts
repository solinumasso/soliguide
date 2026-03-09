import {
  ADMINISTRATIVE_DEFAULT_VALUES,
  FAMILY_DEFAULT_VALUES,
  GENDER_DEFAULT_VALUES,
  OTHER_DEFAULT_VALUES,
  WelcomedPublics,
} from "@soliguide/common";

import { Schema } from "mongoose";

import {
  administrativeSituationsValidator,
  familySituationsValidator,
  gendersValidator,
  otherSituationsValidator,
} from "./validators";

import { ApiPublics } from "../interfaces";

export const PublicsSchema = new Schema<ApiPublics>(
  {
    accueil: {
      default: WelcomedPublics.UNCONDITIONAL,
      enum: WelcomedPublics,
      type: Number,
    },

    administrative: {
      default: ADMINISTRATIVE_DEFAULT_VALUES,
      type: [String],
      validate: administrativeSituationsValidator,
    },

    age: {
      max: { default: 99, type: Number },
      min: { default: 0, type: Number },
    },

    description: {
      default: null,
      type: String,
    },

    familialle: {
      default: FAMILY_DEFAULT_VALUES,
      type: [String],
      validate: familySituationsValidator,
    },

    gender: {
      default: GENDER_DEFAULT_VALUES,
      type: [String],
      validate: gendersValidator,
    },

    other: {
      default: OTHER_DEFAULT_VALUES,
      type: [String],
      validate: otherSituationsValidator,
    },
  },
  { strict: true, _id: false }
);
