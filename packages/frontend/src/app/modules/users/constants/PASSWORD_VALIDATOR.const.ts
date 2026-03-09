import { Validators } from "@angular/forms";
import { PasswordValidator } from "../services/password-validator.service";

export const PASSWORD_VALIDATOR = [
  Validators.required,
  PasswordValidator.patternValidator(/\d/, {
    hasNumber: true,
  }),
  PasswordValidator.patternValidator(/[A-Z]/, {
    hasCapitalCase: true,
  }),
  PasswordValidator.patternValidator(/[a-z]/, {
    hasLowerCase: true,
  }),
  PasswordValidator.patternValidator(/[!"#$%&'()*+,-.\/:;<=>?@\[\]^_`{|}~]/, {
    hasSpecialChar: true,
  }),
  Validators.minLength(8),
  Validators.maxLength(200),
];
