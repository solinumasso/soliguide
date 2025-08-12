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

import type { ExpressRequest, ExpressResponse } from "../../_models";

import { getAreasFromLocation } from "../../search/services";

export const overrideLocationWithAreasInfo = async (
  req: ExpressRequest,
  _res: ExpressResponse,
  next: NextFunction
): Promise<void> => {
  try {
    const areas = await getAreasFromLocation(req.bodyValidated.location);
    // Necessary for adding location informations when request is from web-app
    req.bodyValidated.location = {
      ...req.bodyValidated.location,
      department: areas.department,
      region: areas.region,
      departmentCode: areas.departmentCode,
      regionCode: areas.regionCode,
      country: areas.country,
    };
  } catch (e) {
    req.log.error(e, "GET_AREAS_FROM_LOCATION_FAILED");
  }

  next();
};
