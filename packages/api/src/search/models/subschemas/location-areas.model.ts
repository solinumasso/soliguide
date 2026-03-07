import { Schema } from "mongoose";

import { CountryCodes, LocationAreas } from "@soliguide/common";

export const locationAreasSchema = new Schema<LocationAreas>(
  {
    // @deprecated
    codePostal: {
      default: null,
      trim: true,
      type: String,
      uppercase: true,
    },
    // @deprecated
    departement: {
      default: null,
      trim: true,
      type: String,
    },
    // @deprecated
    departementCode: {
      default: null,
      index: true,
      trim: true,
      type: String,
      uppercase: true,
    },

    // @deprecated
    pays: {
      default: "France",
      required: true,
      trim: true,
      type: String,
    },
    region: {
      default: null,
      trim: true,
      type: String,
    },
    regionCode: {
      default: null,
      index: true,
      trim: true,
      type: String,
      uppercase: true,
    },
    // @deprecated
    ville: {
      default: null,
      trim: true,
      type: String,
    },

    city: {
      trime: true,
      type: String,
    },
    cityCode: {
      trime: true,
      type: String,
    },
    department: {
      trime: true,
      type: String,
    },
    departmentCode: {
      trime: true,
      type: String,
    },
    postalCode: {
      trime: true,
      type: String,
    },

    slugs: {
      department: {
        default: null,
        index: true,
        lowercase: true,
        trim: true,
        type: String,
      },

      country: {
        default: CountryCodes.FR,
        index: true,
        lowercase: true,
        trim: true,
        type: String,
      },
      region: {
        default: null,
        index: true,
        lowercase: true,
        trim: true,
        type: String,
      },

      city: {
        default: null,
        index: true,
        lowercase: true,
        trim: true,
        type: String,
      },
      // @deprecated
      ville: {
        default: null,
        index: true,
        lowercase: true,
        trim: true,
        type: String,
      },
      departement: {
        default: null,
        index: true,
        lowercase: true,
        trim: true,
        type: String,
      },
      pays: {
        default: "france",
        index: true,
        lowercase: true,
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
