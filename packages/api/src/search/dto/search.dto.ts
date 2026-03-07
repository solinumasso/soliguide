import {
  PLACE_LANGUAGES_LIST_MAP_KEY,
  WIDGETS_AVAILABLE,
} from "@soliguide/common";

import { body } from "express-validator";

import { searchLocationsDto } from "./searchLocations.dto";

import { CHECK_STRING_NULL } from "../../config/expressValidator.config";

import { searchOptionsDto } from "../../general/dto/searchOptions.dto";

import { categoriesDto, categoryDto } from "./categories.dto";
import { placeTypeDto } from "./placeType.dto";
import { searchUpdatedAtDto } from "./searchUpdatedAt.dto";
import { publicsDto } from "./publics.dto";
import { textSearchDto } from "./text-search.dto";

export const searchDto = [
  ...searchLocationsDto(),
  ...searchLocationsDto("locations.*."),
  ...searchOptionsDto,
  ...categoriesDto,
  ...categoryDto,
  ...placeTypeDto,
  ...searchUpdatedAtDto(),
  ...publicsDto,
  ...textSearchDto("word"),
  body("openToday").if(body("openToday").exists(CHECK_STRING_NULL)).isBoolean(),

  // TODO: go further with the modalities inspection to get the data in the right format
  body("modalities").if(body("modalities").exists(CHECK_STRING_NULL)),

  body("languages")
    .if(body("languages").exists(CHECK_STRING_NULL))
    .isIn(PLACE_LANGUAGES_LIST_MAP_KEY),

  body("widgetId")
    .if(body("widgetId").exists(CHECK_STRING_NULL))
    .isIn(WIDGETS_AVAILABLE),

  body("options.sortBy")
    .if(body("options.sortBy").exists(CHECK_STRING_NULL))
    .isIn([
      "createdAt",
      "lieu_id",
      "name",
      "distance",
      "slugs.infos.name",
      "status",
      // we keep updatedAt field for api users
      "updatedAt",
    ]),
];
