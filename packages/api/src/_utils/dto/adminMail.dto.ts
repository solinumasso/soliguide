import { body } from "express-validator";

export const adminMailDto = [
  body("mail").custom((mail, { req }) => {
    if (
      req.user.mail !== mail &&
      (mail.endsWith("@solinum.org") || mail.endsWith("@soliguide.fr"))
    ) {
      throw new Error("EDITION_FORBIDDEN");
    }

    return true;
  }),
];
