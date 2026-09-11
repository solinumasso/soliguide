import DOMPurify from "isomorphic-dompurify";
import striptags from "striptags";

import { stripXmlControlChars } from "./xml-control-chars";

/**
 * Text parsers for the DTO layer.
 *
 * Two kinds of text enter the API. A plain field (a name, an address, a city, a
 * precision) must never carry markup: it is displayed as text everywhere, so any tag
 * that reaches the database is either an escaping bug waiting to happen or an attempt
 * at injection. A rich field (a description written in the editor) legitimately
 * carries formatting, and is reduced here to an allow-list of tags with every
 * attribute removed apart from a link target whose scheme is checked.
 *
 * Both parsers refuse rather than silently repair, so the client is told what was
 * wrong, except for characters that no client ever types on purpose (the control
 * characters XML forbids), which are simply removed.
 */

export const TEXT_ERRORS = {
  CONTAINS_HTML: "TEXT_CONTAINS_HTML",
  CONTAINS_HTML_ENTITY: "TEXT_CONTAINS_HTML_ENTITY",
  CONTAINS_SCRIPT_URI: "TEXT_CONTAINS_SCRIPT_URI",
  CONTAINS_TEMPLATE_EXPRESSION: "TEXT_CONTAINS_TEMPLATE_EXPRESSION",
  TOO_LONG: "TEXT_TOO_LONG",
  TOO_SHORT: "TEXT_TOO_SHORT",
} as const;

/** Any tag-looking construct, including an unclosed one such as `<img src=x` */
const HTML_TAG_REGEXP = /<[a-z!/?]/i;

/** `&lt;`, `&#60;`, `&#x3c;`: an encoded tag is still an attempt at markup */
const HTML_ENTITY_REGEXP = /&(?:#x?[0-9a-f]+|[a-z][a-z0-9]{1,31});/i;

/** Schemes that execute or embed instead of navigating */
const DANGEROUS_URI_REGEXP = /(?:javascript|vbscript|data|file|blob)\s*:/i;

/** Server-side template and expression delimiters */
const TEMPLATE_EXPRESSION_REGEXP = /\$\{|\{\{|<%|%>/;

/**
 * The editor's formatting, and nothing else. The same library sanitizes on display in
 * the web-app and the design-system, so a description is cleaned identically on the
 * way in and on the way out.
 */
const RICH_TEXT_CONFIG = {
  ALLOWED_TAGS: [
    // Without "#text" DOMPurify drops the text nodes along with the tags
    "#text",
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "ul",
    "ol",
    "li",
    "a",
    "h2",
    "h3",
    "h4",
    "blockquote",
  ],
  ALLOWED_ATTR: ["href", "title"],
  // Only the schemes that navigate, plus anchors and relative paths
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|[#/])/i,
  FORBID_TAGS: [
    "script",
    "style",
    "iframe",
    "object",
    "embed",
    "form",
    "input",
  ],
  FORBID_ATTR: ["style", "srcset", "formaction", "target"],
  // A tag that is merely unknown is unwrapped and its text kept, so pasted content is
  // not silently lost. A script or style block is a different case: DOMPurify drops
  // those with their content, so the code never survives as text.
  KEEP_CONTENT: true,
};

/** True when the value carries markup, encoded markup or an executable scheme */
export const containsMarkup = (value: string): boolean =>
  HTML_TAG_REGEXP.test(value) ||
  HTML_ENTITY_REGEXP.test(value) ||
  DANGEROUS_URI_REGEXP.test(value);

/**
 * Length is measured on the text a reader actually sees: markup and non-breaking
 * spaces are removed first, so a description cannot be padded past the limit with
 * tags, nor rejected because of them.
 */
export const measureTextLength = (value: string): number =>
  striptags(value)
    .replace(/&nbsp;/gi, " ")
    .trim().length;

export const checkStringLength = (
  value: string,
  min: number,
  max: number
): boolean => {
  const length = measureTextLength(value);

  if (length > max) {
    throw new Error(TEXT_ERRORS.TOO_LONG);
  }

  if (length < min) {
    throw new Error(TEXT_ERRORS.TOO_SHORT);
  }

  return true;
};

/**
 * Refuses a plain-text value that carries markup or an executable scheme.
 * Throws a stable error code, so the check belongs in a `custom()` and never in a
 * `customSanitizer()`, whose exceptions express-validator does not catch.
 */
export const checkPlainText = (value: string): boolean => {
  if (HTML_TAG_REGEXP.test(value)) {
    throw new Error(TEXT_ERRORS.CONTAINS_HTML);
  }

  if (HTML_ENTITY_REGEXP.test(value)) {
    throw new Error(TEXT_ERRORS.CONTAINS_HTML_ENTITY);
  }

  if (DANGEROUS_URI_REGEXP.test(value)) {
    throw new Error(TEXT_ERRORS.CONTAINS_SCRIPT_URI);
  }

  if (TEMPLATE_EXPRESSION_REGEXP.test(value)) {
    throw new Error(TEXT_ERRORS.CONTAINS_TEMPLATE_EXPRESSION);
  }

  return true;
};

/**
 * Normalises a plain-text value: removes the control characters XML forbids and
 * collapses the whitespace runs a copy-paste leaves behind. Never throws, so it is
 * safe inside a sanitizer.
 */
export const parsePlainText = (value: string): string =>
  stripXmlControlChars(value)
    .replace(/[\t\f\v ]{2,}/g, " ")
    .trim();

/**
 * Reduces a rich-text value to the allowed tags and attributes. A script or style
 * block is dropped with its content, since removing the tags alone would leave the
 * code behind as text. Never throws, so it is safe inside a sanitizer.
 */
export const parseRichText = (value: string): string =>
  DOMPurify.sanitize(stripXmlControlChars(value), RICH_TEXT_CONFIG).trim();
