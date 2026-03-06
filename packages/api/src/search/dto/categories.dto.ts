import { body } from "express-validator";
import {
  Categories,
  UserStatus,
  DEFAULT_SERVICES_TO_EXCLUDE_WITH_ADDICTION,
} from "@soliguide/common";

import { CHECK_STRING_NULL } from "../../config";

const sanitizeCategories = (categories: Categories[]) => {
  return categories.map((category) => category as Categories);
};

export const categoryDto = [
  body("category")
    .if(body("category").exists(CHECK_STRING_NULL))
    .isIn(Object.values(Categories)),
];

export const categoriesDto = [
  body("categories")
    .if((value: any) => value)
    .isArray()
    .if(body("categories.*").isIn(Object.values(Categories))) // We use the wildcard otherwise only the first element of the array is checked
    .custom((categories: Categories[], { req }) => {
      if (
        ![
          UserStatus.API_USER,
          UserStatus.WIDGET_USER,
          UserStatus.SOLI_BOT,
        ].includes(req.user?.status)
      ) {
        throw new Error(
          "Only Solibot, API and widget users are allowed to search by multiples categories"
        );
      } else {
        for (const category of categories) {
          if (!Object.values(Categories).includes(category)) {
            throw new Error(`Category ${category} doesn't exist`);
          }
        }
        return true;
      }
    })
    .customSanitizer((categories: Categories[]) =>
      sanitizeCategories(categories)
    ),
];

export const categoriesToExcludeDto = [
  body("catToExclude")
    .if(body("catToExclude").exists(CHECK_STRING_NULL))
    .isArray()
    .custom((value: Categories[]) => {
      for (const category of value) {
        if (!DEFAULT_SERVICES_TO_EXCLUDE_WITH_ADDICTION.includes(category)) {
          return false;
        }
      }
      return true;
    })
    .customSanitizer((categories: Categories[]) =>
      sanitizeCategories(categories)
    ),
];
