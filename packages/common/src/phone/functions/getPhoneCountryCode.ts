import { CountryCodes } from "../../location";
import { Phone } from "../interfaces";

/**
 * The country a phone number must be interpreted with.
 *
 * Falls back to the country of the current theme (+33 France, +34 Spain,
 * +376 Andorra) when the record carries no explicit country code. Without this
 * fallback `phoneUtil.parse` throws on a blank region and the number is dropped
 * entirely instead of being parsed with a sensible default.
 */
export const getPhoneCountryCode = (
  phone: Phone,
  defaultCountry: CountryCodes
): string => (phone?.countryCode || defaultCountry).toLowerCase();
