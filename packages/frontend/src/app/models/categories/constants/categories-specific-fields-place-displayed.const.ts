export const CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED: Record<
  "title" | "body",
  string[]
> = {
  body: [
    "jobsList",
    "foodProductType",
    "otherProductTypePrecisions",
    "serviceStyleType",
    "dietaryRegimesType",
    "dietaryAdaptationsType",
    "degreeOfChoiceType",
    "availableEquipmentType",
    "availableEquipmentPrecisions",
    "babyParcelAgeType",
    "voucherType",
    "voucherTypePrecisions",
    "usageModality",
  ],
  title: [
    "courseType",
    "canteensMealType",
    "domiciliationType",
    "wellnessActivityName",
    "hygieneProductType",
    "activityName",
  ],
};

export const CATEGORIES_SPECIFIC_FIELDS_PLACE_DISPLAYED_IN_MANAGE: string[] = [
  "organicOriginProductType",
  "nationalOriginProductType",
];
