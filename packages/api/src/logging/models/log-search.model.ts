import {
  ADMINISTRATIVE_DEFAULT_VALUES,
  FAMILY_DEFAULT_VALUES,
  GENDER_DEFAULT_VALUES,
  OTHER_DEFAULT_VALUES,
  PLACE_LANGUAGES_LIST_MAP_KEY_FOR_LOGS,
  GeoTypes,
  SortingOrder,
  WelcomedPublics,
  PlaceType,
  Categories,
  AutoCompleteType,
} from "@soliguide/common";

import { ObjectId } from "mongodb";

import { Schema, model } from "mongoose";

import { UserForLogsSchema } from "./subschemas/user-for-logs.schema";

import { locationAreasSchema } from "../../search/models/subschemas/location-areas.model";
import { LogSearchPlaces } from "../interfaces";

const LogSearchPlacesSchema = new Schema<LogSearchPlaces>(
  {
    adminSearch: { default: false, type: Boolean },
    category: {
      enum: [...Object.values(Categories), null],
      default: null,
      type: String,
    },

    categories: {
      enum: Categories,
      type: [String],
    },

    languages: {
      default: null,
      enum: PLACE_LANGUAGES_LIST_MAP_KEY_FOR_LOGS,
      lowercase: true,
      trim: true,
      type: String,
    },

    location: {
      // @deprecated: delete this when all data's worfklow is migrated
      areas: locationAreasSchema,
      coordinates: {
        default: [0, 0],
        type: [Number],
      },
      distance: {
        default: null,
        type: Number,
      },
      geoType: {
        default: null,
        enum: GeoTypes,
        trim: true,
        type: String,
      },
      geoValue: {
        default: null,
        index: true,
        lowercase: true,
        trim: true,
        type: String,
      },
      label: {
        default: null,
        index: true,
        trim: true,
        type: String,
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

    modalities: {
      animal: {
        type: Boolean,
      },
      appointment: {
        type: Boolean,
      },
      inconditionnel: {
        type: Boolean,
      },
      inscription: {
        type: Boolean,
      },
      orientation: {
        type: Boolean,
      },
      pmr: {
        type: Boolean,
      },
      price: {
        type: Boolean,
      },
    },

    nbResults: {
      default: 0,
      required: true,
      type: Number,
    },

    openToday: {
      type: Boolean,
    },

    options: {
      limit: {
        type: Number,
      },
      page: {
        type: Number,
      },
      sortBy: {
        type: String,
      },
      sortValue: {
        enum: SortingOrder,
        type: Number,
      },
    },

    placeType: {
      default: PlaceType.PLACE,
      enum: PlaceType,
      type: String,
    },

    publics: {
      accueil: {
        enum: WelcomedPublics,
        type: Number,
      },
      administrative: {
        enum: ADMINISTRATIVE_DEFAULT_VALUES,
        type: [String],
      },
      age: {
        type: Number,
      },
      familialle: {
        enum: FAMILY_DEFAULT_VALUES,
        type: [String],
      },
      gender: {
        enum: GENDER_DEFAULT_VALUES,
        type: [String],
      },
      other: {
        enum: OTHER_DEFAULT_VALUES,
        type: [String],
      },
    },

    user: {
      ref: "User",
      type: ObjectId,
    },

    userData: UserForLogsSchema,

    word: {
      default: null,
      type: String,
    },

    suggestionType: {
      type: String,
      enum: [...Object.values(AutoCompleteType), "EMPTY"],
      required: true,
    },

    slug: {
      default: null,
      type: String,
    },

    updatedAt: {
      default: null,
      type: Object,
    },
  },
  {
    collection: "search",
    strict: true,
    timestamps: true,
  }
);

export const LogSearchPlacesModel = model("LogSearch", LogSearchPlacesSchema);
