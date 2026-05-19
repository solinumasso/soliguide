import { AbstractControl, ValidationErrors } from "@angular/forms";
import { EMAIL_VALIDATOR_CONFIG } from "@soliguide/common";
import isEmail from "validator/lib/isEmail";

export const EmailValidator = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control?.value) {
    return null;
  }
  return !isEmail(control?.value.trim(), EMAIL_VALIDATOR_CONFIG)
    ? { invalidEmail: true }
    : null;
};
