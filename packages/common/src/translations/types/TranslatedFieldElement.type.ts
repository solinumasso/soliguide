import { PlaceTranslatedFieldElement } from "../enums/PlaceTranslatedFieldElement.enum";
import { ServiceTranslatedFieldElement } from "../enums/ServiceTranslatedFieldElement.enum";

export type TranslatedFieldElement =
  | ServiceTranslatedFieldElement
  | PlaceTranslatedFieldElement;
