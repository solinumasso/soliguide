import { body } from "express-validator";

import mongoose from "mongoose";

import { CHECK_STRING_NULL } from "../../config/expressValidator.config";

/**
 * `isMongoId` replaces `ObjectId.isValid`, which also accepts any number and any
 * twelve-character string. `bail()` keeps the conversion from running on a value the
 * check refused: a BSON error raised inside a sanitizer escapes the chain, and
 * express-validator answers 500 instead of 400.
 *
 * The optional variants are skipped only when the field is absent or null. An empty
 * string is accepted and becomes null, which is how a client clears the reference;
 * every other value is checked rather than copied into the validated body.
 */
export const validObjectIdDto = [
  body("_id").exists(CHECK_STRING_NULL).isString().bail().isMongoId(),
];

const optionalObjectIdChain = (path: string) =>
  body(path)
    .optional({ values: "null" })
    .isString()
    .bail()
    .custom((value: string) => value === "" || mongoose.isValidObjectId(value))
    .bail()
    .customSanitizer((value: string) =>
      value === "" ? null : new mongoose.Types.ObjectId(value)
    );

export const parseObjectIdOptionalDto = [optionalObjectIdChain("_id")];

export const parseServiceObjectIdDto = [
  optionalObjectIdChain("serviceObjectId"),
];
