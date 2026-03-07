import mongoose from "mongoose";
import { locationAreasSchema } from "./location-areas.model";
import { SubSchemaId } from "../../../_models/mongo/types";
import { GeoPosition } from "@soliguide/common";

export const LocationLightSchema = new mongoose.Schema<
  SubSchemaId<
    Pick<
      GeoPosition,
      | "areas"
      | "coordinates"
      | "region"
      | "country"
      | "city"
      | "department"
      | "postalCode"
    >
  >
>(
  {
    areas: locationAreasSchema,
    coordinates: {
      default: [0, 0],
      type: [Number],
    },
    // New fields in data's worfklow schema
    region: {
      trim: true,
      type: String,
    },
    country: {
      trim: true,
      type: String,
    },
    city: {
      trim: true,
      type: String,
    },
    department: {
      trim: true,
      type: String,
    },
    postalCode: {
      index: true,
      trim: true,
      type: String,
    },
  },
  {
    strict: true,
    _id: false,
  }
);
