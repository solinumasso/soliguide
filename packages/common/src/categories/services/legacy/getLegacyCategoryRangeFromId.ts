import { LEGACY_CATEGORIES, LEGACY_CATEGORIES_RANGE } from "../../constants";

// [CATEGORY] File to remove after complete switch
export const getLegacyCategoryRangeFromId = (
  catId: number
): { from: number; to: number } => {
  const index = LEGACY_CATEGORIES[catId].label;
  return LEGACY_CATEGORIES_RANGE[index];
};
