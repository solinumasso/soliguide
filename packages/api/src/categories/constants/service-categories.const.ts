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
  initializeCategoriesApiByTheme,
  initializeCategoriesForCategoriesApiV2,
  Themes,
} from "@soliguide/common";

// all categories for the API independently of the theme
export const SERVICE_CATEGORIES_API_ALL = initializeCategoriesApiByTheme();

export const SERVICE_CATEGORIES_API_FR = initializeCategoriesApiByTheme(
  Themes.SOLIGUIDE_FR
);

export const SERVICE_CATEGORIES_API_ES = initializeCategoriesApiByTheme(
  Themes.SOLIGUIA_ES
);

export const SERVICE_CATEGORIES_API_AD = initializeCategoriesApiByTheme(
  Themes.SOLIGUIA_AD
);

export const SERVICE_CATEGORIES_API_ALL_V2 =
  initializeCategoriesForCategoriesApiV2();
