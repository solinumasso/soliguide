export const generateCompleteArray = (from: number, to: number): number[] => {
  const n = to - from + 1;
  return [...Array(n).keys()].map((i) => i + from);
};
