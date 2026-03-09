import { CommonNewPlaceService, CommonPlaceService } from "../../place";
import {
  getCategoryFromLegacyCategory,
  getLegacyCategoryFromCategory,
} from "./legacy";
import { CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING } from "../constants";
import { CategoriesSpecificFields } from "../interfaces";
import {
  CanteensMealType,
  FrenchCourseType,
  DomiciliationType,
  HygieneProductType,
  Categories,
} from "../enums";

// [CATEGORY] File to remove after complete switch
export const updateServicesWithNewCategories = (
  service: any,
  deleteLegacyCategories = false
): CommonNewPlaceService => {
  const categorie: number = service.categorie;
  const name = service.name;
  const jobsList = service.jobsList;

  if (deleteLegacyCategories) {
    delete service.categorie;
    delete service.jobsList;
    delete service.name;
  }

  const category = getCategoryFromLegacyCategory(categorie);

  let obsoleteCategory: Categories | string | null =
    getCategoryFromLegacyCategory(Math.floor(categorie / 100) * 100);

  if (!category) {
    obsoleteCategory = obsoleteCategory
      ? `${obsoleteCategory.toString()}-${categorie}`
      : obsoleteCategory;
  }

  if (category) {
    // Add categorySpecificField for category who have sub categories
    if (category in CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING) {
      const categorySpecificFields: CategoriesSpecificFields = {};
      const specificFieldsNameArray =
        CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING[category];

      specificFieldsNameArray?.forEach((propertyName) => {
        if (propertyName === "jobsList") {
          if (service.jobsList) {
            categorySpecificFields.jobsList = jobsList;
          }
        } else if (propertyName === "canteensMealType") {
          if (
            Object.values(CanteensMealType).includes(
              service.name as CanteensMealType
            )
          ) {
            categorySpecificFields.canteensMealType = name as CanteensMealType;
          }
        } else if (propertyName === "courseType") {
          if (
            Object.values(FrenchCourseType).includes(name as FrenchCourseType)
          ) {
            categorySpecificFields.courseType = name as FrenchCourseType;
          }
        } else if (propertyName === "domiciliationType") {
          if (
            Object.values(DomiciliationType).includes(name as DomiciliationType)
          ) {
            categorySpecificFields.domiciliationType =
              name as DomiciliationType;
          }
        } else if (propertyName === "hygieneProductType") {
          if (
            Object.values(HygieneProductType).includes(
              name as HygieneProductType
            )
          ) {
            categorySpecificFields.hygieneProductType =
              name as HygieneProductType;
          }
        } else if (name) {
          categorySpecificFields[
            propertyName as keyof CategoriesSpecificFields
          ] = name;
        }
      });
      if (Object.keys(categorySpecificFields).length > 0) {
        return { ...service, category, categorySpecificFields };
      }
    }
    return { ...service, category };
  } else if (obsoleteCategory) {
    return { ...service, category: obsoleteCategory };
  } else if (!categorie) {
    return { ...service, category: null };
  }
  throw new Error(`Category (${categorie}) doesn't match any new category`);
};

export const updateServicesWithLegacyCategories = (
  service: any,
  deleteLegacyCategories = false
): CommonPlaceService => {
  const category: Categories = service.category;

  const categorySpecificFields: CategoriesSpecificFields =
    service.categorySpecificFields;

  if (!category) {
    throw new Error("No category in service");
  }

  if (deleteLegacyCategories) {
    delete service.category;
    delete service.categorySpecificFields;
  }

  const categorie = getLegacyCategoryFromCategory(category);

  if (categorie) {
    // Add sub categories for categories that have categorySpecificField
    service.categorie = categorie;
    if (categorySpecificFields) {
      for (const categorySpecificField of Object.keys(categorySpecificFields)) {
        const legacySpecificField =
          categorySpecificFields[
            categorySpecificField as keyof CategoriesSpecificFields
          ];
        if (categorySpecificField === "jobsList") {
          service.jobsList = legacySpecificField;
        } else if (legacySpecificField && !Array.isArray(legacySpecificField)) {
          service.name = legacySpecificField;
        }
      }
    }
  }

  return service;
};
