/**
 * Checks if a string value can be used as enum value
 * For example, with this we can know if "food" can be used as Categories.FOOD (= "food")
 */
const isValidStringEnumValue = <T extends object>(enumeration: T, value: string): boolean => {
  return Object.values(enumeration)
    .map((item) => String(item))
    .includes(value);
};

export { isValidStringEnumValue };
