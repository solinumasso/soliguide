export const htmlTagSanitizerAndLengthCheck = (
  description: string,
  min: number,
  max: number
): string => {
  const htmlTagRegExp = new RegExp(/(<([^>]+)>)|(&nbsp;)/gi);
  const sanitizedDescription = description.replace(htmlTagRegExp, "").trim();

  if (sanitizedDescription.length > max) {
    throw new Error(`Description must not exceed ${max} characters`);
  } else if (sanitizedDescription.length < min) {
    throw new Error(`Description must be at least ${min} characters`);
  }

  return description;
};
