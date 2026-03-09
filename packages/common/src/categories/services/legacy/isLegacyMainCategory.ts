import { LEGACY_CATEGORIES } from "../../constants";

// [CATEGORY] File to remove after complete switch
export const isLegacyMainCategory = (category: number): boolean =>
  category % 100 === 0 && typeof LEGACY_CATEGORIES[category] !== "undefined";
