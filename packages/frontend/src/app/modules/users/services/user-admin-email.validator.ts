import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";
import { validateUserStatusWithEmail } from "@soliguide/common";

export function userAdminEmailValidator(
  statusControlName: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    const status = control.root.get(statusControlName)?.value;

    return status ? validateUserStatusWithEmail(status, email) : null;
  };
}
