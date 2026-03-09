/**
 * Sorting function that does not modify the param array
 * Because it does a shallow copy before sorting
 */
const sort = <T>(array: T[], comparator: (a: T, b: T) => number): T[] => {
  // eslint-disable-next-line fp/no-mutating-methods
  return [...array].sort(comparator);
};

export { sort };
