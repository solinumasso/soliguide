import { CountryCodes } from "../../location";
import { Phone } from "../interfaces";
import { getPhoneCountryCode } from "./getPhoneCountryCode";

import libPhoneNumber from "google-libphonenumber";
const { PhoneNumberFormat, PhoneNumberUtil } = libPhoneNumber;

export const phoneUtil = PhoneNumberUtil.getInstance();

/**
 * Formats a phone number for display: NATIONAL form when it belongs to the
 * current country, INTERNATIONAL form otherwise.
 *
 * The returned value contains separators and must never be used in a `tel:`
 * href — use `buildTelHref` for that.
 */
export const parsePhoneNumber = (
  phone: Phone,
  currentCountry: CountryCodes
): string | null => {
  if (phone?.isSpecialPhoneNumber) {
    return phone?.phoneNumber;
  }

  if (!phone?.phoneNumber) {
    return null;
  }

  const phoneCountryCode = getPhoneCountryCode(phone, currentCountry);

  try {
    const phoneNumber = phoneUtil.parse(phone.phoneNumber, phoneCountryCode);
    if (!phoneUtil.isValidNumber(phoneNumber) || !phoneNumber) {
      return null;
    }

    const format =
      phoneCountryCode !== currentCountry
        ? PhoneNumberFormat.INTERNATIONAL
        : PhoneNumberFormat.NATIONAL;
    return phoneUtil.format(phoneNumber, format);
  } catch (error) {
    return null;
  }
};
