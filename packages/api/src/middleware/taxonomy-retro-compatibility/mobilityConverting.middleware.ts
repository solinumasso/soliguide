import {
  convertOldToNewMobilityCategory,
  isLegacyMobilityCategory,
  UserStatus,
} from "@soliguide/common";
import { NextFunction } from "express";
import { ExpressRequest, ExpressResponse } from "../../_models";

export const mobilityConverting = (
  req: ExpressRequest,
  _res: ExpressResponse,
  next: NextFunction
) => {
  // Convert legacy mobility categories to new categories for API users

  if (req.user.status !== UserStatus.API_USER) {
    return next();
  }

  // Track if we need to convert results back to legacy format
  req.shouldConvertMobilityCategories = false;

  // Convert single category
  if (req.body.category && isLegacyMobilityCategory(req.body.category)) {
    const newCategory = convertOldToNewMobilityCategory(req.body.category);
    if (newCategory) {
      req.body.category = newCategory;
      req.shouldConvertMobilityCategories = true;
    }
  }

  // Convert multiple categories
  if (req.body.categories?.length) {
    const hasLegacyCategory = req.body.categories.some(
      (categorie: string) =>
        typeof categorie === "string" && isLegacyMobilityCategory(categorie)
    );

    if (hasLegacyCategory) {
      req.body.categories = req.body.categories.map((category: string) => {
        if (
          typeof category === "string" &&
          isLegacyMobilityCategory(category)
        ) {
          const newCategory = convertOldToNewMobilityCategory(category);
          return newCategory ?? category;
        }
        return category;
      });
      req.shouldConvertMobilityCategories = true;
    }
  }

  next();
};
