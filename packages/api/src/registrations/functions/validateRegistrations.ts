import {
  DEFAULT_REGISTRATION_SCOPE,
  REGISTRATION_SCOPES,
  type Registration,
  type RegistrationScheme,
  type RegistrationScope,
  type Registrations,
} from "@soliguide/common";

import { REGISTRATION_VALIDATORS } from "../validators";

export type RegistrationsValidationError =
  | "REGISTRATION_INVALID_FORMAT"
  | "REGISTRATION_SCHEME_NOT_ALLOWED"
  | "REGISTRATION_SCOPE_NOT_ALLOWED"
  | "REGISTRATION_INVALID_VALUE";

export type RegistrationsValidationResult =
  | { ok: true; value: Registrations }
  | { ok: false; error: RegistrationsValidationError; scheme?: string };

/**
 * Trim, drop spaces and dashes, uppercase
 */
export const normalizeRegistrationValue = (value: string): string =>
  value.replace(/[\s-]/g, "").toUpperCase();

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Validates and normalizes a `registrations` payload.
 * - `null` / `undefined` mean "no identifier": an empty map is returned
 * - every key must be one of `allowedSchemes` (the schemes of the place's country, or SIRET only for organizations)
 * - `scope` defaults to ORGANIZATION and must be a known scope
 * - `value` is normalized then checked by the scheme's validator
 */
export const validateRegistrations = (
  registrations: unknown,
  allowedSchemes: RegistrationScheme[]
): RegistrationsValidationResult => {
  if (registrations === null || registrations === undefined) {
    return { ok: true, value: {} };
  }

  if (!isPlainObject(registrations)) {
    return { ok: false, error: "REGISTRATION_INVALID_FORMAT" };
  }

  const value: Registrations = {};

  for (const [scheme, registration] of Object.entries(registrations)) {
    if (!allowedSchemes.includes(scheme as RegistrationScheme)) {
      return { ok: false, error: "REGISTRATION_SCHEME_NOT_ALLOWED", scheme };
    }

    // An empty entry means "remove this identifier"
    if (registration === null || registration === undefined) {
      continue;
    }

    if (!isPlainObject(registration)) {
      return { ok: false, error: "REGISTRATION_INVALID_FORMAT", scheme };
    }

    const rawValue = registration.value;
    if (typeof rawValue !== "string") {
      return { ok: false, error: "REGISTRATION_INVALID_VALUE", scheme };
    }

    const normalizedValue = normalizeRegistrationValue(rawValue);
    if (normalizedValue === "") {
      continue;
    }

    const scope = (registration.scope ??
      DEFAULT_REGISTRATION_SCOPE) as RegistrationScope;
    if (!REGISTRATION_SCOPES.includes(scope)) {
      return { ok: false, error: "REGISTRATION_SCOPE_NOT_ALLOWED", scheme };
    }

    if (
      !REGISTRATION_VALIDATORS[scheme as RegistrationScheme](normalizedValue)
    ) {
      return { ok: false, error: "REGISTRATION_INVALID_VALUE", scheme };
    }

    const cleaned: Registration = { value: normalizedValue, scope };
    value[scheme as RegistrationScheme] = cleaned;
  }

  return { ok: true, value };
};
