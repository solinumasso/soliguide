import { body } from "express-validator";

import { AnyDepartmentCode } from "@soliguide/common";

import { CHECK_STRING_NULL } from "../../config/expressValidator.config";
import { countryDto } from "./country.dto";
import { ExpressRequest } from "../../_models";
import { checkRightsForTerritories } from "../functions/check-rights-for-territories";

/**
 * `bail()` after each type check is what keeps the sanitizer from running on a value
 * that is not an array: express-validator does not catch an exception raised inside a
 * `customSanitizer`, so `[...new Set(42)]` would answer 500 instead of 400.
 */
const departmentListDto = (path: string) => [
  body(path)
    .if(body(path).exists(CHECK_STRING_NULL))
    .isArray()
    .bail()
    .customSanitizer((departments: AnyDepartmentCode[] = []) => [
      ...new Set(departments),
    ]),

  body(`${path}.*`).isString(),
];

export const territoriesDto = [
  body("territories")
    .if(body("territories").exists(CHECK_STRING_NULL))
    .isArray()
    .bail()
    .custom((territories: AnyDepartmentCode[], { req }) =>
      checkRightsForTerritories(territories, req as ExpressRequest)
    )
    .bail()
    .customSanitizer((territories: AnyDepartmentCode[] = []) => [
      ...new Set(territories),
    ]),

  body("territories.*").isString(),

  ...departmentListDto("areas.*.departments"),
  ...departmentListDto("areas.*.regions"),
  ...departmentListDto("areas.*.cities"),

  ...countryDto,
];
