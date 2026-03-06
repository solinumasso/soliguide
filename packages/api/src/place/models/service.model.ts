import {
  Modalities,
  Publics,
  ServiceSaturation,
  CommonOpeningHours,
  CommonNewPlaceService,
  Categories,
} from "@soliguide/common";

import mongoose from "mongoose";

import { OpeningHoursSchema } from "./opening-hours.model";
import { ModalitiesSchema } from "./modalities.model";
import { PublicsSchema } from "./publics.model";
import { CategorySpecificFieldsSchema } from "./category-specific-fields.model";
import { ModelWithId } from "../../_models";

export const ServiceSchema = new mongoose.Schema<
  ModelWithId<CommonNewPlaceService>
>(
  {
    categorie: { type: Number },
    category: { required: true, type: String, enum: Categories },

    close: {
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
    },

    description: { default: null, trim: true, type: String },

    differentHours: { default: false, type: Boolean },
    differentModalities: { default: false, type: Boolean },
    differentPublics: { default: false, type: Boolean },

    hours: {
      default: new CommonOpeningHours(),
      type: OpeningHoursSchema,
    },

    isOpenToday: {
      default: true,
      required: true,
      type: Boolean,
    },

    modalities: {
      default: new Modalities(),
      type: ModalitiesSchema,
    },

    publics: {
      default: new Publics(),
      type: PublicsSchema,
    },
    saturated: {
      precision: { default: null, trim: true, type: String },
      status: {
        default: ServiceSaturation.LOW,
        type: String,
        enum: ServiceSaturation,
      },
    },
    serviceObjectId: { required: true, type: mongoose.Schema.Types.ObjectId },
    createdAt: {
      default: new Date(),
      required: true,
      type: Date,
    },

    categorySpecificFields: {
      type: CategorySpecificFieldsSchema,
    },

    // [CATEGORY] To remove
    jobsList: { default: null, trim: true, type: String },
    name: { default: null, trim: true, type: String },
  },
  { strict: true, _id: false }
);
