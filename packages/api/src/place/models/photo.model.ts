import { Schema, model } from "mongoose";

import { ApiPlacePhoto } from "../../_models";

const PhotosSchema = new Schema<ApiPlacePhoto>(
  {
    encoding: { type: String, trim: true },
    filename: { type: String, required: true },
    mimetype: { type: String, required: true },
    parcours_id: { type: Number },
    path: { type: String, required: true },
    lieu_id: { type: Number, required: true },
    size: { type: Number },
  },
  { collection: "photos", strict: true, timestamps: true }
);

export const PhotoModel = model<ApiPlacePhoto>("Photos", PhotosSchema);
