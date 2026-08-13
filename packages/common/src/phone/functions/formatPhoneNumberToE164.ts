import libPhoneNumber from "google-libphonenumber";

import { CountryCodes } from "../../location";
import { Phone } from "../interfaces";
import { getPhoneCountryCode } from "./getPhoneCountryCode";
import { phoneUtil } from "./parsePhoneNumber";

const { PhoneNumberFormat } = libPhoneNumber;

/** Characters a phone keypad can actually dial. */
const NON_DIALABLE_CHARACTERS = /[^\d+*#]/gu;

/**
 * Formats a phone number in E.164 form (`+<countryCallingCode><nationalNumber>`,
 * no separators), which is what a `tel:` href needs so that a call placed from
 * any country reaches the right number.
 *
 * Producing a human-readable number is `parsePhoneNumber`'s job: its
 * INTERNATIONAL output contains spaces and is not a valid `tel:` target.
 *
 * Special (short) numbers only exist nationally, so they are returned with
 * separators stripped rather than converted to E.164.
 *
 * Validity is checked with `isPossibleNumber` rather than `isValidNumber`: a
 * dialable number whose range is not yet in libphonenumber's metadata (recent
 * Spanish and Andorran ranges) must still be callable.
 */
export const formatPhoneNumberToE164 = (
  phone: Phone,
  defaultCountry: CountryCodes
): string | null => {
  if (!phone?.phoneNumber) {
    return null;
  }

  if (phone.isSpecialPhoneNumber) {
    return phone.phoneNumber.replace(NON_DIALABLE_CHARACTERS, "") || null;
  }

  try {
    const parsedNumber = phoneUtil.parse(
      phone.phoneNumber,
      getPhoneCountryCode(phone, defaultCountry)
    );

    if (!phoneUtil.isPossibleNumber(parsedNumber)) {
      return null;
    }

    return phoneUtil.format(parsedNumber, PhoneNumberFormat.E164);
  } catch {
    return null;
  }
};

/**
 * The `tel:` href for a phone record, or `null` when the number cannot be
 * dialed — callers should then render a disabled control rather than a link.
 */
export const buildTelHref = (
  phone: Phone,
  defaultCountry: CountryCodes
): string | null => {
  const e164Number = formatPhoneNumberToE164(phone, defaultCountry);

  return e164Number ? `tel:${e164Number}` : null;
};
