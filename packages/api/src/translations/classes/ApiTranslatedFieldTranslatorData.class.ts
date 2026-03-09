import {
  TranslatedFieldLanguageStatus,
  TranslatedFieldTranslatorData,
} from "@soliguide/common";

import mongoose from "mongoose";

export class ApiTranslatedFieldTranslatorData
  implements TranslatedFieldTranslatorData
{
  public content: string;
  public status: TranslatedFieldLanguageStatus;
  public translatorName: string | null;
  public translator: mongoose.Types.ObjectId | null;
  public updatedAt: Date;

  constructor(
    translatedFieldTranslatorData?: Partial<ApiTranslatedFieldTranslatorData>
  ) {
    this.content = translatedFieldTranslatorData?.content ?? "";
    this.status =
      translatedFieldTranslatorData?.status ??
      TranslatedFieldLanguageStatus.NOT_TRANSLATED;
    this.translatorName = translatedFieldTranslatorData?.translatorName ?? "";
    this.translator = translatedFieldTranslatorData?.translator ?? null;
    this.updatedAt = translatedFieldTranslatorData?.updatedAt ?? new Date();
  }
}
