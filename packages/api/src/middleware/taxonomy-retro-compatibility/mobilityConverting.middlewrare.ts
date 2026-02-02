/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {
  convertOldToNewMobilityCategory,
  isLegacyMobilityCategory,
  UserStatus,
} from "@soliguide/common";
import { NextFunction } from "express";
import { ExpressRequest, ExpressResponse } from "src/_models";

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
  if (
    req.bodyValidated.category &&
    isLegacyMobilityCategory(req.bodyValidated.category)
  ) {
    const newCategory = convertOldToNewMobilityCategory(
      req.bodyValidated.category
    );
    if (newCategory) {
      req.bodyValidated.category = newCategory;
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
