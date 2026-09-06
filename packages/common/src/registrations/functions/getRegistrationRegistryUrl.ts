import { REGISTRATION_REGISTRY_URL_TEMPLATES } from "../constants";
import { RegistrationScheme } from "../enums";

/**
 * Link to the public reference website for an identifier, or `null` when none exists
 */
export const getRegistrationRegistryUrl = (
  scheme: RegistrationScheme,
  value: string
): string | null => {
  const template = REGISTRATION_REGISTRY_URL_TEMPLATES[scheme];
  if (!template || !value) {
    return null;
  }
  return template.replace("{value}", encodeURIComponent(value));
};
