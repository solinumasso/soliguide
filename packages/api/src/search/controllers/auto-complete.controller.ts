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
  AutoCompleteType,
  SearchAutoComplete,
  slugString,
} from "@soliguide/common";
import * as AutoCompleteService from "../services/auto-complete.service";

// @deprecated
export const searchTerm = async (
  rawTerm: string
): Promise<SearchAutoComplete> => {
  const finalResult: SearchAutoComplete = {
    categories: [],
    terms: [],
  };

  const cleanTerm = slugString(rawTerm);
  const autoCompleteResults = await AutoCompleteService.searchTerm(cleanTerm);

  for (const result of autoCompleteResults) {
    if (result._id === AutoCompleteType.EXPRESSION) {
      finalResult.terms = result.values;
    } else {
      finalResult.categories = result.values;
    }
  }

  return finalResult;
};
