import { CountryCodes } from "../../location";
import { Phone } from "../interfaces";

import libPhoneNumber from "google-libphonenumber";
const { PhoneNumberFormat, PhoneNumberUtil } = libPhoneNumber;

export const phoneUtil = PhoneNumberUtil.getInstance();

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

  try {
    const phoneNumber = phoneUtil.parse(
      phone.phoneNumber,
      phone.countryCode.toLowerCase()
    );
    if (!phoneUtil.isValidNumber(phoneNumber) || !phoneNumber) {
      return null;
    }

    const format =
      phone.countryCode !== currentCountry
        ? PhoneNumberFormat.INTERNATIONAL
        : PhoneNumberFormat.NATIONAL;
    return phoneUtil.format(phoneNumber, format);
  } catch (error) {
    return null;
  }
};
