import { body } from "express-validator";

import {
  getRegistrationSchemesForCountry,
  type SoliguideCountries,
} from "@soliguide/common";

import type { ExpressRequest } from "../../_models";
import { validateRegistrations } from "../functions";

const getAllowedSchemes = (req: ExpressRequest) =>
  getRegistrationSchemesForCountry(req.body?.country as SoliguideCountries);

/**
 * Validates and normalizes the optional `registrations` field of a body.
 * Absent -> untouched. `null` or `{}` -> every identifier is removed.
 * Allowed schemes are those of the `country` sent in the same body (places and organizations alike):
 * an entity cannot be identified in several countries.
 */
export const registrationsDto = [
  body("registrations")
    .optional()
    .custom((registrations, { req }) => {
      const result = validateRegistrations(
        registrations,
        getAllowedSchemes(req as ExpressRequest)
      );
      if (!result.ok) {
        throw new Error(result.error);
      }
      return true;
    })
    .customSanitizer((registrations, { req }) => {
      const result = validateRegistrations(
        registrations,
        getAllowedSchemes(req as ExpressRequest)
      );
      return result.ok ? result.value : registrations;
    }),
];
