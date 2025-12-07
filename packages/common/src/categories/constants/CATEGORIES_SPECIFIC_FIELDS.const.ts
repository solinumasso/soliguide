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

import { Categories } from "../enums";
import { CategoriesSpecificFieldsCategoryMapping } from "../types";

export const CATEGORIES_SPECIFIC_FIELDS_CATEGORY_MAPPING: CategoriesSpecificFieldsCategoryMapping =
  {
    [Categories.INTEGRATION_THROUGH_ECONOMIC_ACTIVITY]: ["jobsList"],
    [Categories.WELLNESS]: ["wellnessActivityName"],
    [Categories.SPORT_ACTIVITIES]: ["activityName"],
    [Categories.OTHER_ACTIVITIES]: ["activityName"],
    [Categories.FRENCH_COURSE]: ["courseType"],
    [Categories.DOMICILIATION]: ["domiciliationType"],
    [Categories.HYGIENE_PRODUCTS]: ["hygieneProductType"],

    //! New categories specific fields to add when ready for production
    [Categories.FOOD_PACKAGES]: [
      "foodProductType",
      "otherProductTypePrecisions",
      "dietaryRegimesType",
      "dietaryAdaptationsType",
      "degreeOfChoiceType",
      "nationalOriginProductType",
      "organicOriginProductType",
    ],
    [Categories.SHARED_KITCHEN]: [
      "availableEquipmentType",
      "availableEquipmentPrecisions",
    ],
    [Categories.COOKING_WORKSHOP]: [
      "dietaryRegimesType",
      "dietaryAdaptationsType",
      "nationalOriginProductType",
      "organicOriginProductType",
    ],
    [Categories.SOCIAL_GROCERY_STORES]: [
      "foodProductType",
      "otherProductTypePrecisions",
      "dietaryRegimesType",
      "dietaryAdaptationsType",
      "degreeOfChoiceType",
      "nationalOriginProductType",
      "organicOriginProductType",
    ],
    [Categories.BABY_PARCEL]: [
      "dietaryRegimesType",
      "dietaryAdaptationsType",
      "degreeOfChoiceType",
      "nationalOriginProductType",
      "organicOriginProductType",
      "babyParcelAgeType",
    ],
    [Categories.FOOD_DISTRIBUTION]: [
      "canteensMealType",
      "serviceStyleType",
      "dietaryRegimesType",
      "dietaryAdaptationsType",
      "degreeOfChoiceType",
      "nationalOriginProductType",
      "organicOriginProductType",
    ],
    [Categories.FOOD_VOUCHER]: [
      "voucherType",
      "voucherTypePrecisions",
      "usageModality",
    ],
    [Categories.COMMUNITY_GARDEN]: ["organicOriginProductType"],
  };
