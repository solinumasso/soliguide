import { CommonPlaceDocument } from "@soliguide/common";
import { Schema, model } from "mongoose";

const DocsSchema = new Schema<CommonPlaceDocument>(
  {
    encoding: { default: null, type: String },
    filename: { default: null, type: String },
    lieu_id: { required: true, type: Number },
    mimetype: { required: true, type: String },
    name: { required: true, type: String },
    path: { required: true, type: String },
    serviceId: { type: Number },
    size: { type: Number },
  },
  { collection: "docs", strict: true, timestamps: true }
);

export const DocsModel = model<CommonPlaceDocument>("Docs", DocsSchema);
