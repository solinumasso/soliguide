import { body } from "express-validator";

import { commonUserFormDto } from "../../user/dto/commonUserForm.dto";
import { emailValidDtoWithPath } from "../../user/dto/emailValid.dto";

export const userContactDto = [
  body("oldPlaceContacts").exists().isArray(),
  body("newPlaceContacts").exists().isArray(),

  ...commonUserFormDto("newPlaceContacts.*."),
  ...commonUserFormDto("oldPlaceContacts.*."),

  ...emailValidDtoWithPath("newPlaceContacts.*."),
  ...emailValidDtoWithPath("oldPlaceContacts.*."),

  body("cguChecked")
    .exists()
    .isBoolean()
    .custom((value, { req }) => {
      if (!value) {
        const oldContactEmail = req.body.oldPlaceContacts.map(
          (contact: { mail: string }) => contact.mail
        );

        const newContactEmail = req.body.newPlaceContacts.map(
          (contact: { mail: string }) => contact.mail
        );

        for (const oldEmail of oldContactEmail) {
          if (!newContactEmail.includes(oldEmail)) {
            throw "CGU_NOT_CHECKED";
          }
        }
      }

      return true;
    }),
];
