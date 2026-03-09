import { LEGACY_CATEGORIES, LEGACY_CATEGORIES_ID } from "../../constants";
import { Categories } from "../../enums";

// [CATEGORY] File to remove after complete switch

export function getCategoryFromLegacyCategory(
  legacyCategory: number
): Categories | null {
  if (LEGACY_CATEGORIES_ID.includes(legacyCategory)) {
    return LEGACY_CATEGORIES[legacyCategory].newCategory;
  }
  return null;
}
