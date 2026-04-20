import { Categories } from "../enums";

export const LEGACY_HEALTH_CATEGORIES_MAPPING: Record<string, Categories> = {
  echography: Categories.PREGNANCY_CARE,
  mammography: Categories.STD_TESTING,
  ophthalmology: Categories.OPTICAL_CARE,
  addiction: Categories.ADDICTION_PREVENTION_AND_MATERIAL,
} as const;

export type LegacyHealthCategory =
  keyof typeof LEGACY_HEALTH_CATEGORIES_MAPPING;
