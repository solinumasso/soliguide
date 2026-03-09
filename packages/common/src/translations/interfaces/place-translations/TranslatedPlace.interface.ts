import { PlaceSummary } from "./PlaceSummary.interface";
import { TranslatedPlaceContent } from "./TranslatedPlaceContent.interface";

import { SupportedLanguagesCode } from "../../enums";
import { CommonPositionForTranslation } from "../../../place";

export interface TranslatedPlace {
  updatedAt: Date;
  createdAt: Date;
  sourceLanguage: SupportedLanguagesCode;
  languages: {
    [lang in SupportedLanguagesCode]?: TranslatedPlaceContent;
  };
  translationRate: number;
  lastUpdate: Date;
  lieu_id: number;
  place: PlaceSummary;
  position: CommonPositionForTranslation;
}
