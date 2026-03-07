import {
  UntypedFormGroup,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { differenceInCalendarDays, isValid } from "date-fns";

export const endDateAfterBeginDateValidator = ({
  beginDateControlName,
  endDateControlName,
}: {
  beginDateControlName: string;
  endDateControlName: string;
}) => {
  return (formGroup: UntypedFormGroup): ValidationErrors | null => {
    const beginDateControl = formGroup.controls[beginDateControlName];
    const endDateControl = formGroup.controls[endDateControlName];

    return endDateAfterBeginDateCheck(beginDateControl, endDateControl);
  };
};

export const endDateAfterBeginDateCheck = (
  beginDateControl: AbstractControl,
  endDateControl: AbstractControl
): ValidationErrors | null => {
  if (beginDateControl.value && endDateControl.value) {
    const beginDateValid = isValid(new Date(beginDateControl.value));
    const endDateValid = isValid(new Date(endDateControl.value));

    if (!beginDateValid || !endDateValid) {
      return null;
    }

    const beginDate = new Date(beginDateControl.value);
    const endDate = new Date(endDateControl.value);

    if (isNaN(beginDate.getTime()) || isNaN(endDate.getTime())) {
      return null;
    }

    if (differenceInCalendarDays(endDate, beginDate) >= 0) {
      return null;
    }

    endDateControl.setErrors({ endDateAfterBeginDate: true });
    return { endDateAfterBeginDate: true };
  }
  return null;
};
