import { SUPPORTED_LANGUAGES } from "@soliguide/common";

import { body } from "express-validator";

import { CHECK_STRING_NULL } from "../../config/expressValidator.config";

import { searchOptionsDto } from "../../general/dto/searchOptions.dto";
import { countryDto } from "../../_utils/dto";

const optionsSortBy = [
  "createdAt",
  "position.departmentCode",
  "lieu_id",
  "translationRate",
  "updatedAt",
];

for (const lang of SUPPORTED_LANGUAGES) {
  optionsSortBy.push(`languages.${lang}.translationRate`);
}

export const searchTranslatedPlaceDto = [
  body("lieu_id")
    .if(body("lieu_id").exists(CHECK_STRING_NULL))
    .isInt({ allow_leading_zeroes: true, min: 0 })
    .toInt(),

  body("lang").if(body("lang").exists()).isIn(SUPPORTED_LANGUAGES),

  body("status").optional().exists(),

  body("options.sortBy")
    .if(body("options.sortBy").exists())
    .isIn(optionsSortBy),
  ...countryDto,
  ...searchOptionsDto,
];
