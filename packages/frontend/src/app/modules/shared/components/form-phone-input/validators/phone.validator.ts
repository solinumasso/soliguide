
import { AbstractControl, ValidationErrors } from "@angular/forms";
import { Phone, REGEXP, phoneUtil } from "@soliguide/common";

export const phoneValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value as Phone;
  if (!value?.phoneNumber || value?.phoneNumber === "") {
    return null;
  }

  if (value?.isSpecialPhoneNumber) {
    return new RegExp(REGEXP.phone).exec(value.phoneNumber)
      ? null
      : { isNotValidPhone: true };
  }

  try {
    const parsedValue = phoneUtil.parse(value.phoneNumber, value.countryCode);
    return phoneUtil.isValidNumber(parsedValue)
      ? null
      : { isNotValidPhone: true };
  } catch (e) {
    return { isNotValidPhone: true };
  }
};
