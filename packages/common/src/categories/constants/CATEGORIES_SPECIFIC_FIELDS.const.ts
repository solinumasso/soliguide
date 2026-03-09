import { Categories } from "../enums";
import { CategoriesSpecificFieldsCategoryMapping } from "../types";

export const CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING: CategoriesSpecificFieldsCategoryMapping =
  {
    [Categories.INTEGRATION_THROUGH_ECONOMIC_ACTIVITY]: ["jobsList"],
    [Categories.WELLNESS]: ["wellnessActivityName"],
    [Categories.SPORT_ACTIVITIES]: ["activityName"],
    [Categories.OTHER_ACTIVITIES]: ["activityName"],
    [Categories.FRENCH_COURSE]: ["courseType"],
    [Categories.DOMICILIATION]: ["domiciliationType"],
    [Categories.HYGIENE_PRODUCTS]: ["hygieneProductType"],

    //! New categories specific fields to add when ready for production
    [Categories.FOOD_PACKAGES]: [
      "foodProductType",
      "otherProductTypePrecisions",
      "dietaryRegimesType",
      "dietaryAdaptationsType",
      "degreeOfChoiceType",
      "nationalOriginProductType",
      "organicOriginProductType",
    ],
    [Categories.SHARED_KITCHEN]: [
      "availableEquipmentType",
      "availableEquipmentPrecisions",
    ],
    [Categories.COOKING_WORKSHOP]: [
      "dietaryRegimesType",
      "dietaryAdaptationsType",
      "nationalOriginProductType",
      "organicOriginProductType",
    ],
    [Categories.SOCIAL_GROCERY_STORES]: [
      "foodProductType",
      "otherProductTypePrecisions",
      "dietaryRegimesType",
      "dietaryAdaptationsType",
      "degreeOfChoiceType",
      "nationalOriginProductType",
      "organicOriginProductType",
    ],
    [Categories.BABY_PARCEL]: [
      "dietaryRegimesType",
      "dietaryAdaptationsType",
      "degreeOfChoiceType",
      "nationalOriginProductType",
      "organicOriginProductType",
      "babyParcelAgeType",
    ],
    [Categories.FOOD_DISTRIBUTION]: [
      "canteensMealType",
      "serviceStyleType",
      "dietaryRegimesType",
      "dietaryAdaptationsType",
      "degreeOfChoiceType",
      "nationalOriginProductType",
      "organicOriginProductType",
    ],
    [Categories.FOOD_VOUCHER]: [
      "voucherType",
      "voucherTypePrecisions",
      "usageModality",
    ],
    [Categories.COMMUNITY_GARDEN]: ["organicOriginProductType"],
  };
