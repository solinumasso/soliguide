// XML 1.0 forbids control characters except TAB (0x09), LF (0x0A) and CR (0x0D)
const INVALID_XML_CHARS_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

export const htmlTagSanitizerAndLengthCheck = (
  description: string,
  min: number,
  max: number
): string => {
  const cleanedDescription = description.replace(INVALID_XML_CHARS_REGEX, "");
  const htmlTagRegExp = new RegExp(/(<([^>]+)>)|(&nbsp;)/gi);
  const sanitizedDescription = cleanedDescription
    .replace(htmlTagRegExp, "")
    .trim();

  if (sanitizedDescription.length > max) {
    throw new Error(`Description must not exceed ${max} characters`);
  } else if (sanitizedDescription.length < min) {
    throw new Error(`Description must be at least ${min} characters`);
  }

  return cleanedDescription;
};
