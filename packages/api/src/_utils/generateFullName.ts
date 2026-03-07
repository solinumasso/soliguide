export const generateFullName = (
  firstName?: string | null,
  lastName?: string | null
) => {
  if (!firstName || firstName === "null") {
    firstName = "";
  }
  if (!lastName || lastName === "null") {
    lastName = "";
  }
  return `${firstName.trim()} ${lastName.trim()}`.trim();
};
