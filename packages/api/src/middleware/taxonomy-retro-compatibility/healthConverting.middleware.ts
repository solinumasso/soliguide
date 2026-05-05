import {
  convertOldToNewHealthCategory,
  isLegacyHealthCategory,
  UserStatus,
} from "@soliguide/common";
import { NextFunction } from "express";
import { ExpressRequest, ExpressResponse } from "../../_models";

export const healthConverting = (
  req: ExpressRequest,
  _res: ExpressResponse,
  next: NextFunction
) => {
  if (req.user.status !== UserStatus.API_USER) {
    return next();
  }

  req.shouldConvertHealthCategories = false;

  // Convert single category
  if (req.body.category && isLegacyHealthCategory(req.body.category)) {
    const newCategory = convertOldToNewHealthCategory(req.body.category);
    if (newCategory) {
      req.body.category = newCategory;
      req.shouldConvertHealthCategories = true;
    }
  }

  // Convert multiple categories
  if (req.body.categories?.length) {
    const hasLegacyCategory = req.body.categories.some(
      (category: string) =>
        typeof category === "string" && isLegacyHealthCategory(category)
    );

    if (hasLegacyCategory) {
      req.body.categories = req.body.categories.map((category: string) => {
        if (typeof category === "string" && isLegacyHealthCategory(category)) {
          const newCategory = convertOldToNewHealthCategory(category);
          return newCategory ?? category;
        }
        return category;
      });
      req.shouldConvertHealthCategories = true;
    }
  }

  next();
};
