import { Directive } from "@angular/core";
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from "@angular/forms";

export const appForbiddenWordsInPublicsValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbiddenWords = [
      /inscription/i,
      /orientation/i,
      /rdv/i,
      /rendez-vous/i,
      /rendez vous/i,
    ];

    for (const word of forbiddenWords) {
      if (word.test(control.value)) {
        return { appForbiddenWordsInPublics: { value: control.value } };
      }
    }

    return null;
  };
};

@Directive({
  selector: "[appForbiddenWordsInPublics]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ForbiddenValidatorDirective,
      multi: true,
    },
  ],
})
export class ForbiddenValidatorDirective implements Validator {
  public validate(control: AbstractControl): ValidationErrors | null {
    return appForbiddenWordsInPublicsValidator()(control);
  }
}
