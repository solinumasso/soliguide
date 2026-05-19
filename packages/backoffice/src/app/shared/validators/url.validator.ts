import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function UrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    try {
      // eslint-disable-next-line no-new
      new URL(value);
      return null;
    } catch {
      try {
        // eslint-disable-next-line no-new
        new URL(`https://${value}`);
        return null;
      } catch {
        return { invalidUrl: true };
      }
    }
  };
}
