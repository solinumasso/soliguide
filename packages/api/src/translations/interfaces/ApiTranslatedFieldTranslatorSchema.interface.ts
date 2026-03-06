import { ApiSubSchema } from "../../place/interfaces";
import { ApiTranslatedFieldTranslatorData } from "../classes";

export interface ApiTranslatedFieldTranslatorSchema
  extends ApiTranslatedFieldTranslatorData,
    ApiSubSchema {}
