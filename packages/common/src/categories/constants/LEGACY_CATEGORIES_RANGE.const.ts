import { LEGACY_CATEGORIES } from "./LEGACY_CATEGORIES.const";

import type { LegacySuperCategoryName } from "../types";

export const LEGACY_CATEGORIES_RANGE: Record<
  LegacySuperCategoryName,
  { from: number; to: number }
> = Object.keys(LEGACY_CATEGORIES).reduce<
  Record<LegacySuperCategoryName, { from: number; to: number }>
>(
  (
    acc: Record<LegacySuperCategoryName, { from: number; to: number }>,
    key: string
  ) => {
    const catId = parseInt(key, 10);
    const serviceSubId = catId % 100;

    if (serviceSubId === 0) {
      acc[LEGACY_CATEGORIES[catId].label] = {
        from: catId + 1,
        to: catId,
      };
    } else {
      acc[LEGACY_CATEGORIES[catId - serviceSubId].label].to++;
    }

    return acc;
  },
  {}
);
