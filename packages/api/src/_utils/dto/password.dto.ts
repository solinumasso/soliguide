import { body, Meta } from "express-validator";

import { PASSWORD_REGEX_VALIDATOR } from "../../config/expressValidator.config";

export const passwordDto = [
  body("password")
    .isString()
    .notEmpty()
    .custom((value: string) => {
      const test = PASSWORD_REGEX_VALIDATOR.test(value);
      if (!test) {
        throw new Error("INVALID_PASSWORD");
      }
      return true;
    }),

  body("passwordConfirmation")
    .isString()
    .notEmpty()
    .custom((passwordConfirmation: string, { req }: Meta) => {
      return passwordConfirmation === req.body.password;
    })
    .withMessage("CONFIRMATION_PASSWORD_DOES_NOT_MATCH"),
];
