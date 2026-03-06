export const kmOrMeters = (input: number): string => {
  const result =
    input < 1000
      ? (10 * Math.floor(input / 10)).toString() + " m"
      : (Math.round(input / 100) / 10).toString() + " km";
  return result.replace(".", ",");
};
