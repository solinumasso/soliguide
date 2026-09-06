import { body } from "express-validator";

const HTTP_SCHEMES = ["http", "https"];

/** A scheme is what precedes the first colon, when the value declares one */
const SCHEME_REGEXP = /^([a-z][a-z0-9+.-]*):/i;

const addHttpsIfNeeded = (url: string) =>
  /^https?:\/\//i.test(url) ? url : `https://${url}`;

/**
 * A URL field.
 *
 * The scheme is checked on the value as it was sent, before the `https://` prefix is
 * added: prefixing first would turn `javascript:alert(1)` into a syntactically valid
 * `https://javascript:alert(1)` and hide the scheme the client actually asked for.
 */
export const checkUrlFieldDto = (urlField: string) =>
  body(urlField)
    .optional({ values: "null" })
    .isString()
    .bail()
    .trim()
    .if((value: string) => value.length > 0)
    .custom((value: string) => {
      const declared = SCHEME_REGEXP.exec(value)?.[1];

      if (declared && !HTTP_SCHEMES.includes(declared.toLowerCase())) {
        throw new Error("INVALID_URL_SCHEME");
      }

      return true;
    })
    .bail()
    .customSanitizer(addHttpsIfNeeded)
    .custom((value: string) => {
      const { protocol } = new URL(value);

      if (!HTTP_SCHEMES.includes(protocol.replace(":", ""))) {
        throw new Error("INVALID_URL_SCHEME");
      }

      return true;
    });
