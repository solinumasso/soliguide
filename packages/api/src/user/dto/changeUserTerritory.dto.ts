import { body } from "express-validator";
import { CHECK_STRING_NULL } from "../../config/expressValidator.config";
import { AnyDepartmentCode } from "@soliguide/common";

export const changeUserTerritoryDto = [
  body("territories")
    .if(body("territories").exists(CHECK_STRING_NULL))
    .isArray()
    .withMessage("Territories must be an array")
    .custom((territories) => {
      for (const territory of territories) {
        if (typeof territory !== "string") {
          throw new Error("INVALID_TERRITORY_FORMAT");
        }
      }
      return true;
    })
    .customSanitizer((territories: AnyDepartmentCode[]) => {
      return [...new Set(territories)];
    }),

  body("areas.*.departments")
    .if(body("areas.*.departments").exists(CHECK_STRING_NULL))
    .isArray()
    .customSanitizer((departments: AnyDepartmentCode[]) => {
      return [...new Set(departments)];
    }),
];
