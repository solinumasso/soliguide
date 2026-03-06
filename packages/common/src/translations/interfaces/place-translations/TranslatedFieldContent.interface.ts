import { TranslatedFieldTranslatorData } from "./TranslatedFieldTranslatorData.interface";

export interface TranslatedFieldContent {
  auto: {
    content: string;
    needHumanReview: boolean;
    updatedAt: Date;
  };
  human: TranslatedFieldTranslatorData;
}
