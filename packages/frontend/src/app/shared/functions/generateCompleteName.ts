export const generateCompleteName = (
  name?: string | null,
  lastname?: string | null
): string => {
  if (
    name == null || // null or undefined
    name === "null"
  ) {
    name = "";
  }
  if (
    lastname == null || // null or undefined
    lastname === "null"
  ) {
    lastname = "";
  }
  const completeName = `${name.trim()} ${lastname.trim()}`;
  return completeName.trim();
};
