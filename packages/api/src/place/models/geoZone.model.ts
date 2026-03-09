import { GeoTypes } from "@soliguide/common";

import { Schema } from "mongoose";

import { GeoZone } from "../interfaces";

export const GeoZoneSchema = new Schema<GeoZone>(
  {
    geoType: {
      default: null,
      enum: GeoTypes,
      type: String,
    },
    geoValue: { lowercase: true, trim: true, type: String },
    label: { trim: true, type: String },
  },
  { _id: false }
);
