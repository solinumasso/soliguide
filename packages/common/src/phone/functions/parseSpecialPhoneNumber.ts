// @deprecated: delete this function when the numbers are migrated on all aspects of the soliguide
// Special telephone numbers have a different format depending on the country, you cannot define a generic rule
export const parseSpecialPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return "";

  phoneNumber = phoneNumber.replace(/^\+33/, "0").replace(/\./g, "").trim();
  const chunks = [];
  while (phoneNumber.length > 0) {
    chunks.unshift(phoneNumber.slice(-2));
    phoneNumber = phoneNumber.slice(0, -2);
  }
  return chunks.join(" ");
};
