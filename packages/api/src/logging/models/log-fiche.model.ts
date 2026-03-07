import mongoose, { model } from "mongoose";
import { Categories, PlaceStatus, PlaceType } from "@soliguide/common";
import { UserForLogsSchema } from "./subschemas/user-for-logs.schema";
import { LocationLightSchema } from "../../search/models/subschemas/location-light.model";

const LogFicheSchema = new mongoose.Schema(
  {
    fiche: {
      ref: "Place",
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },

    ficheId: { required: true, type: Number },

    location: {
      default: null,
      type: LocationLightSchema,
    },

    // Whether the place still exist in Soliguide
    placeOnline: {
      default: true,
      required: true,
      type: Boolean,
    },

    placeType: {
      default: PlaceType.PLACE,
      enum: PlaceType,
      required: true,
      type: String,
    },

    seoUrl: { default: null, required: true, trim: true, type: String },

    // All categories from the place services
    serviceCategories: {
      default: [],
      enum: Categories,
      type: [String],
    },

    status: {
      default: PlaceStatus.ONLINE,
      enum: PlaceStatus,
      required: true,
      type: String,
    },

    userDatas: { type: UserForLogsSchema },
  },
  {
    collection: "logFiches",
    strict: true,
    timestamps: true,
  }
);

export const LogFicheModel = model("LogFiche", LogFicheSchema);
