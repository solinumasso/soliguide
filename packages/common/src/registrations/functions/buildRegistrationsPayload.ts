import { DEFAULT_REGISTRATION_SCOPE, RegistrationScheme } from "../enums";
import { Registration, Registrations } from "../interfaces";

/**
 * What a form sends: `null` on a scheme means "remove this identifier"
 */
export type RegistrationsPayload = Partial<
  Record<RegistrationScheme, Registration | null>
>;

/**
 * Raw form values: one string per scheme displayed in the form
 */
export type RegistrationsFormValues = Partial<
  Record<RegistrationScheme, string | null>
>;

/**
 * Builds the `registrations` payload from the form inputs.
 * Schemes absent from the form are kept as they are; an existing scope is preserved
 * (it may have been set by an admin or a partner), otherwise the default applies.
 */
export const buildRegistrationsPayload = (
  current: Registrations | undefined | null,
  values: RegistrationsFormValues
): RegistrationsPayload => {
  const payload: RegistrationsPayload = { ...(current ?? {}) };

  const entries = Object.entries(values) as Array<
    [RegistrationScheme, string | null | undefined]
  >;

  for (const [scheme, value] of entries) {
    const trimmed = value?.trim() ?? "";
    payload[scheme] = trimmed
      ? {
          value: trimmed,
          scope: current?.[scheme]?.scope ?? DEFAULT_REGISTRATION_SCOPE,
        }
      : null;
  }

  return payload;
};
