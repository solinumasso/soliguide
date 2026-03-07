import { body } from "express-validator";

import { CHECK_STRING_NULL } from "../../config/expressValidator.config";
import { PLACE_LANGUAGES_LIST_MAP_KEY } from "@soliguide/common";

export const languagesDto = (path = "") => {
  if (path === "") {
    return [
      body(`${path}languages`)
        .exists(CHECK_STRING_NULL)
        .isArray({ min: 1 })
        .toArray()
        .customSanitizer((value) => [...new Set(value)]),

      body(`${path}languages.*`).custom((value) =>
        PLACE_LANGUAGES_LIST_MAP_KEY.includes(value)
      ),
    ];
  } else {
    return [];
  }
};
