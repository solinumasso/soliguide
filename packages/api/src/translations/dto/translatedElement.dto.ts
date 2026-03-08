import { body } from "express-validator";

import { CHECK_STRING_NULL } from "../../config/expressValidator.config";
import {
  PLACE_LANGUAGES_LIST_MAP_KEY,
  TranslatedFieldStatus,
} from "@soliguide/common";

export const translatedElementDto = [
  body("content").exists(CHECK_STRING_NULL),
  body("lang").exists().isIn(PLACE_LANGUAGES_LIST_MAP_KEY),
  body("status")
    .if(body("status").exists())
    .exists(CHECK_STRING_NULL)
    .isIn(Object.values(TranslatedFieldStatus)),
];
