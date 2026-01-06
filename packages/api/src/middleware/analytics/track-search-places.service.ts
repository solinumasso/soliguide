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
import { ExpressRequest } from "../../_models/express";
import { TRACKED_EVENTS } from "../../analytics/constants";
import { PosthogClient } from "../../analytics/services";

import { LogSearchPlaces } from "../../logging/interfaces";

export const getSearchPropertiesFromRequest = (
  req: ExpressRequest
): LogSearchPlaces => {
  const { category, expression } = req.bodyValidated;

  const searchType =
    category && expression
      ? "expression_and_category"
      : category
      ? "category"
      : "expression";

  return {
    ...req.bodyValidated,
    user: { ...req.userForLogs! },
    search_type: searchType,
    nbResults: req.nbResults ?? 0,
  };
};

export const trackSearchPlaces = (req: ExpressRequest) => {
  try {
    PosthogClient.instance.capture({
      event: TRACKED_EVENTS.API_SEARCH_PLACES,
      req,
      properties: getSearchPropertiesFromRequest(req),
    });
  } catch {
    req.log.error("LOG_API_SEARCH_PLACES_ERROR");
  }
};
