import type {
  LegacySpecialCatTypesKeys,
  LegacySubCategoryOptions,
} from "../types";

export const LEGACY_SPECIAL_NAME_CAT: number[] = [
  202, 204, 303, 305, 402, 602, 801, 804, 1204,
];

export const LEGACY_FRENCH_COURSES_SUB_CAT: LegacySubCategoryOptions = [
  { name: "ALPHABETISATION", value: "alphabetisation" },
  { name: "ASL", value: "asl" },
  { name: "FLE", value: "fle" },
];

export const LEGACY_CARE_PRODUCTS_SUB_CAT: LegacySubCategoryOptions = [
  { name: "SANITARY_MATERIALS", value: "sanitary_materials" },
  { name: "OTHER_CARE_PRODUCTS", value: "other_care_products" },
];

export const LEGACY_DOMICILIATIONS_SUB_CAT: LegacySubCategoryOptions = [
  { name: "DOMI1", value: "domi1" },
  { name: "DOMI2", value: "domi2" },
  { name: "DOMI4", value: "domi4" },
];

export const LEGACY_CANTEENS_SUB_CAT: LegacySubCategoryOptions = [
  { name: "PETITDEJ", value: "petitdej" },
  { name: "COLLATION", value: "collation" },
  { name: "BOISSON", value: "boisson" },
  { name: "DEJEUNER", value: "dejeuner" },
  { name: "GOUTER", value: "gouter" },
  { name: "DINER", value: "diner" },
];

export const LEGACY_SPECIAL_CAT_TYPES: Record<
  number,
  { options: LegacySubCategoryOptions; translationKey: string }
> = {
  202: {
    options: LEGACY_FRENCH_COURSES_SUB_CAT,
    translationKey: "FRENCH_COURSES_TYPE",
  },
  305: {
    options: LEGACY_CARE_PRODUCTS_SUB_CAT,
    translationKey: "CARE_PRODUCTS_TYPE",
  },
  402: {
    options: LEGACY_DOMICILIATIONS_SUB_CAT,
    translationKey: "DOMICILIATIONS_TYPE",
  },
  602: { options: LEGACY_CANTEENS_SUB_CAT, translationKey: "CANTEENS_TYPE" },
};

export const LEGACY_SPECIAL_CAT_TYPES_KEYS: LegacySpecialCatTypesKeys[] =
  Object.keys(LEGACY_SPECIAL_CAT_TYPES).map(Number);
