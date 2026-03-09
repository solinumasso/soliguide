import {
  AvailableEquipmentType,
  BabyParcelAgeType,
  CanteensMealType,
  DegreeOfChoiceType,
  DietaryAdaptationsType,
  DietaryRegimesType,
  DomiciliationType,
  FoodProductType,
  FrenchCourseType,
  HygieneProductType,
  NationalProductType,
  OrganicProductType,
  ServiceStyleType,
  VoucherType,
} from "../enums";

export interface CategoriesSpecificFields {
  activityName?: string;
  availableEquipmentPrecisions?: string;
  availableEquipmentType?: AvailableEquipmentType[];
  babyParcelAgeType?: BabyParcelAgeType[];
  canteensMealType?: CanteensMealType;
  courseType?: FrenchCourseType;
  degreeOfChoiceType?: DegreeOfChoiceType;
  dietaryAdaptationsType?: DietaryAdaptationsType[];
  dietaryRegimesType?: DietaryRegimesType;
  domiciliationType?: DomiciliationType;
  foodProductType?: FoodProductType[];
  otherProductTypePrecisions?: string;
  hygieneProductType?: HygieneProductType;
  jobsList?: string;
  nationalOriginProductType?: NationalProductType;
  organicOriginProductType?: OrganicProductType;
  serviceStyleType?: ServiceStyleType[];
  usageModality?: string;
  voucherType?: VoucherType;
  voucherTypePrecisions?: string;
  wellnessActivityName?: string;
}
