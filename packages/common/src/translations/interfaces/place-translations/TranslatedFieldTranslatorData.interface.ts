import { TranslatedFieldLanguageStatus } from "../../enums";

export interface TranslatedFieldTranslatorData {
  content: string;
  status: TranslatedFieldLanguageStatus;
  translatorName: string | null;
  updatedAt: Date;
}
