import {
  FILE_TYPES,
  SortingFilters,
  SUPPORTED_LANGUAGES,
} from "@soliguide/common";

import { body } from "express-validator";

import { CHECK_STRING_NULL } from "../../config/expressValidator.config";

import { searchAdminDto } from "../../search/dto/searchAdmin.dto";

// Must match values in packages/frontend/src/app/modules/admin-place/types/format-export.type.ts
export const AutoExportDto = [
  ...searchAdminDto,
  body("exportParams").exists().isObject(),

  body("exportParams.fileType")
    .if(body("exportParams").exists())
    .exists(CHECK_STRING_NULL)
    .isIn(FILE_TYPES),

  body("exportParams.language")
    .if(body("language").exists())
    .exists(CHECK_STRING_NULL)
    .isIn(SUPPORTED_LANGUAGES),

  body("exportParams.sortingFilter")
    .if(body("exportParams").exists())
    .exists(CHECK_STRING_NULL)
    .isIn(Object.values(SortingFilters)),

  body("exportParams.infos").exists().isObject(),
  body("exportParams.infos.*").exists().isBoolean(),
];
