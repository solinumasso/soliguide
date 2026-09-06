import { body } from "express-validator";

import { CHECK_STRING_NULL } from "../../config/expressValidator.config";
import {
  checkPlainText,
  checkStringLength,
  parsePlainText,
  parseRichText,
} from "../functions";

/**
 * A required field must carry a value. An optional one is skipped only when it is
 * absent or null: every other value is checked, so a `0`, a `false` or a `NaN` is
 * refused instead of being copied into the validated body by `matchedData`, which
 * returns the raw value of any chain a condition skipped.
 * An empty string stays allowed on an optional field, since that is how a client
 * clears it.
 */
const baseChain = (path: string, required: boolean) =>
  required
    ? body(path).exists(CHECK_STRING_NULL).isString().bail().trim()
    : body(path)
        .optional({ values: "null" })
        .isString()
        .bail()
        .trim()
        .if((value: string) => value.length > 0);

/**
 * A plain-text field: a name, an address, a city, a precision.
 *
 * `isString().bail()` comes first so a non-string never reaches `trim()`: a standard
 * validator receives the value converted to a string, and that conversion reads only
 * the first element of an array, so `["text"]` would otherwise pass every check and
 * reach Mongoose as an array.
 *
 * The value is then refused if it carries markup, an encoded tag or an executable
 * scheme, so neither HTML nor script ever reaches the database through these fields.
 */
export const stringDto = (path = "", required = true, max = 10000, min = 1) =>
  baseChain(path, required)
    .custom((value: string) => checkPlainText(value))
    .bail()
    .custom((value: string) => checkStringLength(value, min, max))
    .bail()
    .customSanitizer((value: string) => parsePlainText(value));

/**
 * A rich-text field: the descriptions written in the editor, which legitimately carry
 * formatting. The markup is reduced to an allow-list of tags with every attribute
 * removed apart from a link target whose scheme is not executable, and the length is
 * measured on the text without its tags.
 */
export const richTextDto = (path = "", required = true, max = 10000, min = 1) =>
  baseChain(path, required)
    .customSanitizer((value: string) => parseRichText(value))
    .custom((value: string) => checkStringLength(value, min, max));
