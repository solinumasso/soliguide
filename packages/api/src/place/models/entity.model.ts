import { Schema } from "mongoose";
import { CommonPlaceEntity } from "@soliguide/common";
import { PhoneSchema } from "./phone.model";

export const EntitySchema = new Schema<CommonPlaceEntity>(
  {
    facebook: { type: String, trim: true },
    fax: { type: String, trim: true },
    instagram: { type: String, trim: true },
    mail: { type: String, trim: true },
    name: { type: String, default: null, trim: true },
    phones: { type: [PhoneSchema] },
    website: { type: String, default: null, trim: true },
  },
  { _id: false, strict: true }
);
