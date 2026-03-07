import { Schema } from "mongoose";

import { ApiPhone } from "../interfaces";
import { COUNTRIES_CALLING_CODES } from "@soliguide/common";

export const PhoneSchema = new Schema<ApiPhone>(
  {
    label: { default: null, trim: true, type: String },
    phoneNumber: { default: null, trim: true, type: String },
    countryCode: {
      trim: true,
      type: String,
      lowercase: true,
      required: true,
      enum: Object.keys(COUNTRIES_CALLING_CODES),
    },
    isSpecialPhoneNumber: { default: false, type: Boolean },
  },
  { _id: false }
);
