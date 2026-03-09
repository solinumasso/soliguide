import { AbstractControl, ValidationErrors } from "@angular/forms";

export const nonEmptyArray = (
  control: AbstractControl
): ValidationErrors | null => {
  if (!control.value || control.value.length === 0) {
    return { noElements: true };
  }
  return null;
};

export const noWhiteSpace = (
  control: AbstractControl
): ValidationErrors | null => {
  const isWhitespace = (control?.value ?? "").trim().length === 0;
  return !isWhitespace ? null : { whitespace: true };
};
