import { CommonPositionForTranslation } from "../../../place";
import { SupportedLanguagesCode, TranslatedFieldStatus } from "../../enums";
import { TranslatedFieldElement } from "../../types";
import { PlaceSummary } from "./PlaceSummary.interface";
import { TranslatedFieldContent } from "./TranslatedFieldContent.interface";

export interface TranslatedField {
  _id: string;
  updatedAt: Date;
  createdAt: Date;
  content: string;
  elementName: TranslatedFieldElement;
  sourceLanguage: SupportedLanguagesCode;
  languages: {
    [key in SupportedLanguagesCode]?: TranslatedFieldContent;
  };
  lieu_id: number;
  place?: PlaceSummary;
  position: CommonPositionForTranslation;
  status: TranslatedFieldStatus;
}
