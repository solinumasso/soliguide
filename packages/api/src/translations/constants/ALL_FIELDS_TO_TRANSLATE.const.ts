import {
  PlaceTranslatedFieldElement,
  ServiceTranslatedFieldElement,
  TranslatedFieldElement,
} from "@soliguide/common";

export const ALL_FIELDS_TO_TRANSLATE: TranslatedFieldElement[] = [
  ...Object.values(ServiceTranslatedFieldElement),
  ...Object.values(PlaceTranslatedFieldElement),
];
