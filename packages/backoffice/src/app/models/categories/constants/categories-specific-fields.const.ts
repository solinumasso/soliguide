import {
  CanteensMealType,
  DomiciliationType,
  FrenchCourseType,
  HygieneProductType,
  FoodProductType,
  ServiceStyleType,
  NationalProductType,
  OrganicProductType,
  DietaryRegimesType,
  DietaryAdaptationsType,
  VoucherType,
  AvailableEquipmentType,
  DegreeOfChoiceType,
  BabyParcelAgeType,
  CategoriesSpecificFieldsEnumValues,
} from "@soliguide/common";

export const CATEGORIES_SPECIFIC_FIELDS_FIELD_TYPE: Record<
  "enumType" | "text" | "textarea" | "checklist",
  string[]
> = {
  enumType: [
    "courseType",
    "domiciliationType",
    "hygieneProductType",
    "canteensMealType",
    "dietaryRegimesType",
    "nationalOriginProductType",
    "organicOriginProductType",
    "voucherType",
    "degreeOfChoiceType",
  ],
  text: ["activityName", "wellnessActivityName"],
  textarea: [
    "jobsList",
    "usageModality",
    "voucherTypePrecisions",
    "otherProductTypePrecisions",
    "availableEquipmentPrecisions",
  ],
  checklist: [
    "availableEquipmentType",
    "babyParcelAgeType",
    "foodProductType",
    "serviceStyleType",
    "dietaryAdaptationsType",
  ],
};

export const CATEGORIES_SPECIFIC_FIELDS_FORM_LABEL: Record<string, string> = {
  activityName: "ACTIVITY_NAME",
  availableEquipmentType: "AVAILABLE_EQUIPMENT_TYPE",
  babyParcelAgeType: "BABY_PARCEL_AGE_TYPE",
  courseType: "FRENCH_COURSES_TYPE",
  degreeOfChoiceType: "DEGREE_OF_CHOICE_TYPE",
  dietaryRegimesType: "DIETARY_REGIMES_TYPE",
  dietaryAdaptationsType: "DIETARY_ADAPTATIONS_TYPE",
  domiciliationType: "DOMICILIATIONS_TYPE",
  foodProductType: "FOOD_PRODUCT_TYPE",
  hygieneProductType: "HYGIENE_PRODUCT_TYPE",
  jobsList: "LIST_JOBS",
  canteensMealType: "CANTEENS_MEAL_TYPE",
  nationalOriginProductType: "NATIONAL_ORIGIN_PRODUCT_TYPE",
  organicOriginProductType: "ORGANIC_ORIGIN_PRODUCT_TYPE",
  serviceStyleType: "SERVICE_STYLE_TYPE",
  usageModality: "USAGE_MODALITY",
  voucherType: "VOUCHER_TYPE",
  wellnessActivityName: "WELLNESS_ACTIVITY_NAME",
};

export const CATEGORIES_SPECIFIC_FIELDS_ENUM_VALUES: Record<
  string,
  CategoriesSpecificFieldsEnumValues
> = {
  courseType: Object.values(FrenchCourseType),
  domiciliationType: Object.values(DomiciliationType),
  hygieneProductType: Object.values(HygieneProductType),
  canteensMealType: Object.values(CanteensMealType),
  foodProductType: Object.values(FoodProductType),
  serviceStyleType: Object.values(ServiceStyleType),
  organicOriginProductType: Object.values(OrganicProductType),
  nationalOriginProductType: Object.values(NationalProductType),
  dietaryRegimesType: Object.values(DietaryRegimesType),
  dietaryAdaptationsType: Object.values(DietaryAdaptationsType),
  voucherType: Object.values(VoucherType),
  availableEquipmentType: Object.values(AvailableEquipmentType),
  degreeOfChoiceType: Object.values(DegreeOfChoiceType),
  babyParcelAgeType: Object.values(BabyParcelAgeType),
};

export const CATEGORIES_SPECIFIC_FIELDS_PLACEHOLDER: Record<string, string> = {
  activityName: "ACTIVITY_NAME_PLACEHOLDER",
  availableEquipmentPrecisions: "AVAILABLE_EQUIPMENT_PRECISIONS_PLACEHOLDER",
  jobsList: "JOBS_LIST_PLACEHOLDER",
  usageModality: "USAGE_MODALITY_PLACEHOLDER",
  voucherTypePrecisions: "VOUCHER_TYPE_PRECISIONS_PLACEHOLDER",
  otherProductTypePrecisions: "OTHER_PRODUCT_TYPE_PRECIIONS_PLACEHOLDER",
  wellnessActivityName: "WELLNESS_ACTIVITY_PLACEHOLDER",
};
