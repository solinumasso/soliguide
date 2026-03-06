import { LEGACY_CATEGORIES } from "./LEGACY_CATEGORIES.const";

import { KeyStringValueNumber } from "../../general";

export const LEGACY_CATEGORIES_SEO: KeyStringValueNumber = Object.keys(
  LEGACY_CATEGORIES
).reduce<KeyStringValueNumber>((acc: KeyStringValueNumber, key: string) => {
  const keyAsInt = parseInt(key, 10);
  acc[LEGACY_CATEGORIES[keyAsInt].seo] = keyAsInt;
  return acc;
}, {});
