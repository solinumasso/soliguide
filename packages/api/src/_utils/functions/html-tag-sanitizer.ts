import { stripXmlControlChars } from "./xml-control-chars";

export const htmlTagSanitizerAndLengthCheck = (
  description: string,
  min: number,
  max: number
): string => {
  const cleanedDescription = stripXmlControlChars(description);
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
