import { Schema } from "mongoose";

import { CommonPlaceSource } from "@soliguide/common";

export const SourceSchema = new Schema<CommonPlaceSource>(
  {
    ids: [
      {
        id: {
          required: true,
          type: String,
        },
        url: {
          required: false,
          type: String,
        },
      },
    ],
    isOrigin: { default: false, required: true, type: Boolean },
    license: { required: false, type: String },
    name: { required: true, type: String },
  },
  { strict: true, _id: false }
);
