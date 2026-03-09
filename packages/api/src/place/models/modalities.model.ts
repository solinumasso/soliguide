import mongoose from "mongoose";

import { ApiModalities } from "../interfaces";

export const ModalitiesSchema = new mongoose.Schema<ApiModalities>(
  {
    inconditionnel: { default: true, type: Boolean },

    appointment: {
      checked: { default: false, type: Boolean },
      precisions: { default: null, type: String },
    },
    inscription: {
      checked: { default: false, type: Boolean },
      precisions: { default: null, type: String },
    },
    orientation: {
      checked: { default: false, type: Boolean },
      precisions: { default: null, type: String },
    },
    price: {
      checked: { type: Boolean },
      precisions: { default: null, type: String },
    },

    animal: { checked: { type: Boolean } },
    pmr: { checked: { type: Boolean } },

    docs: [{ default: [], ref: "Docs", type: mongoose.Schema.Types.ObjectId }],

    other: { default: null, type: String },
  },
  { strict: true, _id: false }
);
