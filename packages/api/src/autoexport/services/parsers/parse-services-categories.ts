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
  SupportedLanguagesCode,
  ApiPlace,
  capitalize,
  Categories,
  CommonNewPlaceService,
  getCategoryTranslationKey,
} from "@soliguide/common";

import { translator } from "../../../config/i18n.config";

export const translateServiceName = (
  category: Categories,
  language: SupportedLanguagesCode
): string => {
  return translator.t(getCategoryTranslationKey(category), { lng: language });
};

export const getAllServicesNames = (
  place: ApiPlace,
  language: SupportedLanguagesCode,
  removeDuplicates = true
): string => {
  let categories = place.services_all.map(
    (service: CommonNewPlaceService) => service.category
  );

  if (removeDuplicates) {
    categories = [...new Set(categories)];
  }

  const translatedServices = categories.map((category: Categories) =>
    translateServiceName(category, language).toLowerCase()
  );

  return capitalize(translatedServices.join(", ").trim());
};
