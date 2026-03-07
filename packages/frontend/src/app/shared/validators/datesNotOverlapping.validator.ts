import type { ValidatorFn, UntypedFormGroup } from "@angular/forms";

import type { TempInfo } from "@soliguide/common";

import { isValid, areIntervalsOverlapping, isWithinInterval } from "date-fns";

import { parseDateFromNgb } from "../bootstrap-util";

export const datesNotOverlappingValidator = ({
  beginDateControlName,
  endDateControlName,
  intervals,
}: {
  beginDateControlName: string;
  endDateControlName: string;
  intervals: TempInfo[];
}): ValidatorFn => {
  return (formGroup: UntypedFormGroup) => {
    const beginDateControl = formGroup.controls[beginDateControlName];
    const endDateControl = formGroup.controls[endDateControlName];

    if (beginDateControl.value && endDateControl.value) {
      const beginDate = isValid(beginDateControl.value)
        ? beginDateControl.value
        : parseDateFromNgb(beginDateControl.value);
      const endDate = isValid(endDateControl.value)
        ? endDateControl.value
        : parseDateFromNgb(endDateControl.value);

      try {
        for (const [index, interval] of intervals.entries()) {
          if (
            formGroup.controls._id?.toString() !== interval._id.toString() &&
            ((!endDate &&
              (!interval.dateFin ||
                (interval.dateDebut &&
                  isWithinInterval(beginDate, {
                    end: interval.dateFin,
                    start: interval.dateDebut,
                  })))) ||
              (endDate &&
                interval.dateDebut &&
                ((!interval.dateFin &&
                  isWithinInterval(interval.dateDebut, {
                    end: endDate,
                    start: beginDate,
                  })) ||
                  (interval.dateFin &&
                    areIntervalsOverlapping(
                      {
                        end: interval.dateFin,
                        start: interval.dateDebut,
                      },
                      {
                        end: endDate,
                        start: beginDate,
                      }
                    )))))
          ) {
            beginDateControl.setErrors({ dateOverlapping: true });
            endDateControl.setErrors({ dateOverlapping: true });
            return { indexDateOverlapping: index };
          }
        }
      } catch {
        beginDateControl.setErrors(null);
        endDateControl.setErrors(null);
        return null;
      }
    }

    beginDateControl.setErrors(null);
    endDateControl.setErrors(null);
    return null;
  };
};
