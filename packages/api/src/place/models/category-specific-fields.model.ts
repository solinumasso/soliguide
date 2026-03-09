import { Schema } from "mongoose";

import {
  CategoriesSpecificFields,
  CanteensMealType,
  FrenchCourseType,
  DomiciliationType,
  HygieneProductType,
  AvailableEquipmentType,
  DegreeOfChoiceType,
  DietaryRegimesType,
  DietaryAdaptationsType,
  VoucherType,
  ServiceStyleType,
  BabyParcelAgeType,
  FoodProductType,
  NationalProductType,
  OrganicProductType,
} from "@soliguide/common";

export const CategorySpecificFieldsSchema =
  new Schema<CategoriesSpecificFields>(
    {
      activityName: { type: String, trim: true },
      availableEquipmentPrecisions: { type: String, trim: true },
      availableEquipmentType: {
        type: [String],
        enum: AvailableEquipmentType,
        default: undefined,
      },
      babyParcelAgeType: {
        type: [String],
        enum: BabyParcelAgeType,
        default: undefined,
      },
      canteensMealType: { type: String, enum: CanteensMealType },
      courseType: { type: String, enum: FrenchCourseType },
      degreeOfChoiceType: { type: String, enum: DegreeOfChoiceType },
      dietaryAdaptationsType: {
        type: [String],
        enum: DietaryAdaptationsType,
        default: undefined,
      },
      dietaryRegimesType: { type: String, enum: DietaryRegimesType },
      domiciliationType: { type: String, enum: DomiciliationType },
      foodProductType: {
        type: [String],
        enum: FoodProductType,
        default: undefined,
      },
      otherProductTypePrecisions: { type: String, trim: true },
      hygieneProductType: { type: String, enum: HygieneProductType },
      jobsList: { type: String, trim: true },
      nationalOriginProductType: {
        type: String,
        enum: NationalProductType,
        default: undefined,
      },
      organicOriginProductType: {
        type: String,
        enum: OrganicProductType,
        default: undefined,
      },
      serviceStyleType: {
        type: [String],
        enum: ServiceStyleType,
        default: undefined,
      },
      usageModality: { type: String, trim: true },
      voucherType: { type: String, enum: VoucherType },
      voucherTypePrecisions: { type: String, trim: true },
      wellnessActivityName: { type: String, trim: true },
    },
    { _id: false, strict: true }
  );
