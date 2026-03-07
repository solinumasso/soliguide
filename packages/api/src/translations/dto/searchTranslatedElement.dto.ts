import { PLACE_LANGUAGES_LIST_MAP_KEY } from "@soliguide/common";

import { body } from "express-validator";
import { CHECK_STRING_NULL } from "../../config/expressValidator.config";
import { searchOptionsDto } from "../../general/dto/searchOptions.dto";
import { countryDto } from "../../_utils/dto";

const optionsSortBy = [
  "createdAt",
  "position.departmentCode",
  "lieu_id",
  "updatedAt",
];

for (const lang of PLACE_LANGUAGES_LIST_MAP_KEY) {
  optionsSortBy.push(`languages.${lang}.human.status`);
}

export const searchTranslatedElementDto = [
  ...countryDto,
  ...searchOptionsDto,

  body("lieu_id")
    .if(body("lieu_id").exists(CHECK_STRING_NULL))
    .isInt({ allow_leading_zeroes: true, min: 0 })
    .toInt(),

  body("status").optional().exists(),

  body("options.sortBy")
    .if(body("options.sortBy").exists())
    .isIn(optionsSortBy),
];
