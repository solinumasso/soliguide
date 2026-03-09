import { body } from "express-validator";

import { AnyDepartmentCode } from "@soliguide/common";

import { CHECK_STRING_NULL } from "../../config/expressValidator.config";
import { countryDto } from "./country.dto";
import { ExpressRequest } from "../../_models";
import { checkRightsForTerritories } from "../functions/check-rights-for-territories";

export const territoriesDto = [
  body("territories")
    .if(body("territories").exists(CHECK_STRING_NULL))
    .isArray()
    .custom((territories: AnyDepartmentCode[], { req }) => {
      return checkRightsForTerritories(territories, req as ExpressRequest);
    })
    .customSanitizer((territories: AnyDepartmentCode) => {
      return [...new Set(territories)];
    }),

  body("areas.*.departments")
    .if(body("areas.*.departments").exists(CHECK_STRING_NULL))
    .isArray()
    .custom((departments: AnyDepartmentCode[], { req }) =>
      checkRightsForTerritories(departments, req as ExpressRequest)
    )
    .customSanitizer((departments: AnyDepartmentCode[] = []) => [
      ...new Set(departments),
    ]),

  body("areas.*.regions")
    .if(body("areas.*.regions").exists(CHECK_STRING_NULL))
    .isArray()
    .customSanitizer((regions: string[] = []) => [...new Set(regions)]),

  body("areas.*.cities")
    .if(body("areas.*.cities").exists(CHECK_STRING_NULL))
    .isArray()
    .customSanitizer((cities: string[] = []) => [...new Set(cities)]),

  ...countryDto,
];
