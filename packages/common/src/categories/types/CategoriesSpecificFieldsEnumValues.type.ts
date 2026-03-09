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
} from "../enums";

export type CategoriesSpecificFieldsEnumValue =
  | CanteensMealType
  | DomiciliationType
  | FrenchCourseType
  | HygieneProductType
  | FoodProductType
  | ServiceStyleType
  | NationalProductType
  | OrganicProductType
  | DietaryRegimesType
  | DietaryAdaptationsType
  | VoucherType
  | AvailableEquipmentType
  | DegreeOfChoiceType
  | BabyParcelAgeType;

export type CategoriesSpecificFieldsEnumValues =
  CategoriesSpecificFieldsEnumValue[];
