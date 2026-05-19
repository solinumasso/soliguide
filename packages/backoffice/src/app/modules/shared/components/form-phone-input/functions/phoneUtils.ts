import { Phone, phoneUtil } from "@soliguide/common";
import { ChangeData, CountryISO } from "ngx-intl-tel-input";
import { THEME_CONFIGURATION } from "../../../../../models";

export function getFormPhone(
  formValue: ChangeData
): Pick<Phone, "phoneNumber" | "countryCode"> {
  return {
    phoneNumber: formValue?.nationalNumber
      ? formValue?.nationalNumber.replace(/\s/g, "")
      : null,
    countryCode: formValue?.countryCode
      ? (formValue?.countryCode.toLowerCase() as CountryISO)
      : THEME_CONFIGURATION.country,
  };
}

export function setFormPhone(
  phone: Pick<Phone, "phoneNumber" | "countryCode">
): ChangeData {
  const defaultReturn = {
    number: "",
    countryCode: THEME_CONFIGURATION.country,
  };
  try {
    const parsedPhone = phoneUtil.parse(phone.phoneNumber, phone.countryCode);

    if (!phoneUtil.isValidNumber(parsedPhone) || !parsedPhone) {
      return defaultReturn;
    }
    return {
      number: parsedPhone.getNationalNumber().toString(),
      countryCode: phone.countryCode,
    };
  } catch (e) {
    return defaultReturn;
  }
}
