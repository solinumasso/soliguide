export function computeArrayDiff<T>(
  oldArray: T[],
  newArray: T[],
  keyFn: (item: T) => unknown = (item) => item
): { added: T[]; removed: T[] } {
  const oldSet = new Set(oldArray.map(keyFn));
  const newSet = new Set(newArray.map(keyFn));
  return {
    added: newArray.filter((item) => !oldSet.has(keyFn(item))),
    removed: oldArray.filter((item) => !newSet.has(keyFn(item))),
  };
}
