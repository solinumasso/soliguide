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

import { CategoriesService, Themes } from "@soliguide/common";
import {
  SERVICE_CATEGORIES_API_AD,
  SERVICE_CATEGORIES_API_ALL,
  SERVICE_CATEGORIES_API_ALL_V2,
  SERVICE_CATEGORIES_API_ES,
  SERVICE_CATEGORIES_API_FR,
} from "../constants/service-categories.const";
import { TypeCategoriesService } from "../types/categories-service.type";
import { TypeCategoriesServiceNotFromThemeEnum } from "../enums/type-categories-service-not-from-theme.enum";

export const getServiceCategoriesApi = (
  typeCategoriesService: TypeCategoriesService
): CategoriesService => {
  switch (typeCategoriesService) {
    case TypeCategoriesServiceNotFromThemeEnum.ALL:
      return SERVICE_CATEGORIES_API_ALL;
    case TypeCategoriesServiceNotFromThemeEnum.V2:
      return SERVICE_CATEGORIES_API_ALL_V2;
    case Themes.SOLIGUIDE_FR:
      return SERVICE_CATEGORIES_API_FR;
    case Themes.SOLIGUIA_ES:
      return SERVICE_CATEGORIES_API_ES;
    case Themes.SOLIGUIA_AD:
      return SERVICE_CATEGORIES_API_AD;
    default:
      return SERVICE_CATEGORIES_API_ALL;
  }
};
