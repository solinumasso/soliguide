import { CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING } from "../constants";
import { Categories } from "../enums";
import { CategoriesSpecificFieldsCategoryMapping } from "../types";
import { CountryCodes } from "../../location/enums/CountryCodes.enum";

export const getCategoriesSpecificFields = (
  country: string
): CategoriesSpecificFieldsCategoryMapping => {
  if (country === CountryCodes.FR) {
    return CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING;
  }

  const fieldsToRemove = [
    "nationalOriginProductType",
    "organicOriginProductType",
  ];

  return (
    Object.entries(CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING) as Array<
      [Categories, string[]]
    >
  ).reduce<CategoriesSpecificFieldsCategoryMapping>(
    (acc, [category, fields]) => {
      if (fields) {
        acc[category] = fields.filter(
          (field) => !fieldsToRemove.includes(field)
        );
      }
      return acc;
    },
    {}
  );
};
