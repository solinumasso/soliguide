// XML 1.0 forbids control characters except TAB (0x09), LF (0x0A) and CR (0x0D)
// eslint-disable-next-line no-control-regex
export const INVALID_XML_CHARS_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/gu;

export const stripXmlControlChars = (value: string): string =>
  value.replace(INVALID_XML_CHARS_REGEX, "");
