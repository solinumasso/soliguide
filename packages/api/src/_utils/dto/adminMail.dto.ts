import { body } from "express-validator";

const RESERVED_MAIL_DOMAINS = ["@solinum.org", "@soliguide.fr"];

/**
 * Forbids claiming a reserved address that is not already the caller's own.
 * The type guard matters: without it a non-string `mail`, or a request with no
 * authenticated user, throws out of the chain and the message of that internal
 * exception is returned to the client as the validation error.
 */
export const adminMailDto = [
  body("mail")
    .isString()
    .bail()
    .custom((mail: string, { req }) => {
      const currentMail =
        typeof req.user?.mail === "string" ? req.user.mail : null;

      if (
        currentMail !== mail &&
        RESERVED_MAIL_DOMAINS.some((domain) => mail.endsWith(domain))
      ) {
        throw new Error("EDITION_FORBIDDEN");
      }

      return true;
    }),
];
