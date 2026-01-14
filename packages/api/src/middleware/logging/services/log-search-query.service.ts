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
import type { NextFunction } from "express";

import type { ExpressRequest, ExpressResponse } from "../../../_models";
import { LogSearchPlacesModel } from "../../../logging/models/log-search.model";
import { getAreasFromLocation } from "../../../search/services";
import { LogSearchPlaces } from "../../../logging/interfaces";
import { findSuggestionBySynonym } from "../../../search/utils/parsers/parse-word";
import { AutoCompleteType } from "@soliguide/common";

export const logSearchQuery = async (
  req: ExpressRequest,
  _res: ExpressResponse,
  next: NextFunction
): Promise<void> => {
  const options = req.bodyValidated?.options;

  if (options?.sort) {
    options["sortBy"] = Object.keys(options.sort)[0];
    options["sortValue"] = Object.values(options.sort)[0];

    delete options.sort;
  }

  const searchData: LogSearchPlaces = {
    ...req.bodyValidated,
    nbResults: req.nbResults,
    options,
    adminSearch: !!req.adminSearch,
    userData: req.userForLogs,
    suggestionType: req?.bodyValidated?.category
      ? AutoCompleteType.CATEGORY
      : "EMPTY",
    slug: req.bodyValidated?.category,
  };

  if (req.bodyValidated?.word) {
    const searchTerm = req.bodyValidated?.word;
    const foundSuggestion = findSuggestionBySynonym(
      searchTerm,
      searchData.languages
    );

    if (foundSuggestion) {
      searchData.suggestionType = foundSuggestion.type;
      searchData.slug = foundSuggestion.slug;
    } else {
      searchData.suggestionType = AutoCompleteType.EXPRESSION;
    }
  }

  try {
    const areas = await getAreasFromLocation(searchData.location);

    searchData.location = {
      ...searchData.location,
      // @deprecated: delete this after migration in data workflows
      areas,
      // new fields to add in data workflow
      region: areas.region,
      department: areas.departement,
      city: areas.city,
      postalCode: areas.postalCode,
      country: areas.country,
    };
  } catch (e) {
    req.log.error(e, "GET_AREAS_FROM_LOCATION_FAILED");
  }

  try {
    await LogSearchPlacesModel.create(searchData);
  } catch (e) {
    req.log.error(e, "LOG_SEARCH_CREATION_FAILED");
  }
  next();
};
