import { ApiTranslatedFieldTranslatorData } from "./ApiTranslatedFieldTranslatorData.class";

export class ApiTranslatedFieldContent {
  public auto: {
    content: string;
    needHumanReview: boolean;
    updatedAt: Date;
  };

  public human: ApiTranslatedFieldTranslatorData;

  constructor(translatedFieldContent?: Partial<ApiTranslatedFieldContent>) {
    this.auto = translatedFieldContent?.auto ?? {
      content: "",
      needHumanReview: true,
      updatedAt: new Date(),
    };

    this.human =
      translatedFieldContent?.human ?? new ApiTranslatedFieldTranslatorData();
  }
}
