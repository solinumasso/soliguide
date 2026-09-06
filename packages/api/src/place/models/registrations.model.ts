import { Schema } from "mongoose";

import {
  DEFAULT_REGISTRATION_SCOPE,
  REGISTRATION_SCOPES,
  type Registration,
  type RegistrationScheme,
} from "@soliguide/common";

export const RegistrationSchema = new Schema<Registration>(
  {
    value: { required: true, trim: true, type: String },
    scope: {
      default: DEFAULT_REGISTRATION_SCOPE,
      enum: REGISTRATION_SCOPES,
      required: true,
      type: String,
    },
  },
  { _id: false, strict: true }
);

/**
 * `registrations` field definition, shared by places and organizations.
 * A Mongoose Map does not validate its keys: we restrict them to the allowed schemes here.
 * The "schemes of the place's country" rule is enforced by the DTO, which knows the country.
 */
export const registrationsField = (allowedSchemes: RegistrationScheme[]) => ({
  type: Map,
  of: RegistrationSchema,
  default: () => new Map(),
  validate: {
    validator: (registrations: Map<string, Registration>): boolean =>
      [...registrations.keys()].every((scheme) =>
        allowedSchemes.includes(scheme as RegistrationScheme)
      ),
    message: "REGISTRATION_SCHEME_NOT_ALLOWED",
  },
});
