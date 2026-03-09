import { LEGACY_CATEGORIES } from "../../constants";
import { Categories } from "../../enums";

// [CATEGORY] File to remove after complete switch
export function getLegacyCategoryFromCategory(
  category: Categories
): number | undefined {
  const legacyCategoryEntry = Object.entries(LEGACY_CATEGORIES).find(
    (legacyCategoryEntry) => legacyCategoryEntry[1].newCategory === category
  );

  if (legacyCategoryEntry) {
    return parseInt(legacyCategoryEntry[0], 10);
  }

  return legacyCategoryEntry;
}
