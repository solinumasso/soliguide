import mongoose from "mongoose";
import { CommonPlacePosition, SOLIGUIDE_COUNTRIES } from "@soliguide/common";

export const PositionSchema = new mongoose.Schema<CommonPlacePosition>({
  location: {
    coordinates: {
      default: [
        0, // Longitude
        0, // Latitude
      ],
      type: [Number],
    },
    type: {
      default: "Point",
      enum: ["Point"],
      type: String,
    },
  },

  // @deprecated start
  adresse: { trim: true, type: String },
  codePostal: {
    index: true,
    trim: true,
    type: String,
    uppercase: true,
  },
  complementAdresse: { default: null, trim: true, type: String },
  departement: { default: null, index: true, type: String },
  departementCode: {
    index: true,
    type: String,
    uppercase: true,
  },
  pays: {
    trim: true,
    type: String,
  },
  ville: { default: null, trim: true, type: String },
  // @deprecated end

  region: {
    trim: true,
    type: String,
    required: true,
  },
  additionalInformation: {
    trim: true,
    type: String,
  },
  address: {
    trim: true,
    type: String,
    required: true,
  },
  country: {
    trim: true,
    type: String,
    enum: SOLIGUIDE_COUNTRIES,
    required: true,
  },
  city: {
    trim: true,
    type: String,
    required: true,
  },
  cityCode: {
    trim: true,
    type: String,
  },
  department: {
    trim: true,
    type: String,
    required: true,
  },
  departmentCode: {
    trim: true,
    index: true,
    type: String,
  },
  postalCode: {
    index: true,
    required: true,
    trim: true,
    type: String,
    uppercase: true,
  },
  regionCode: {
    trim: true,
    type: String,
    required: true,
  },
  timeZone: {
    trim: true,
    type: String,
    required: true,
  },

  slugs: {
    // @deprecated start
    departement: {
      index: true,
      trim: true,
      type: String,
      lowercase: true,
    },
    country: {
      index: true,
      lowercase: true,
      trim: true,
      type: String,
    },
    department: {
      trim: true,
      type: String,
    },
    city: {
      index: true,
      lowercase: true,
      trim: true,
      type: String,
    },
    region: {
      index: true,
      lowercase: true,
      trim: true,
      type: String,
    },
  },
});

PositionSchema.index({ location: "2dsphere" });
