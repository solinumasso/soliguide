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

import { type ApiPlace, TempInfoType } from "@soliguide/common";

import {
  deleteTempServiceClosureWithParams,
  insertNewTempServiceClosure,
} from "../services/temp-service-closure.service";
import type {
  ExpressRequest,
  ExpressResponse,
  ModelWithId,
} from "../../_models";
import { findTempInfoWithParams } from "../services/temp-info.service";

export const rebuildTempServiceClosure = async (
  req: ExpressRequest,
  _res: ExpressResponse,
  next: NextFunction
): Promise<void> => {
  const place: ModelWithId<ApiPlace> | null =
    req.updatedPlace ?? req.placeDeleted ?? null;
  if (place) {
    // First we delete all temporary service closures associated to this place
    await deleteTempServiceClosureWithParams({ place: place._id });

    // Then we rebuild all the temporary service closures that are relevant
    const tempClosuresOnPlace = await findTempInfoWithParams({
      place: place._id,
      tempInfoType: {
        $in: [TempInfoType.CLOSURE, TempInfoType.SERVICE_CLOSURE],
      },
    });

    for (const closure of tempClosuresOnPlace) {
      if (closure.tempInfoType === TempInfoType.SERVICE_CLOSURE) {
        if (!closure.serviceObjectId) {
          req.log.error(`Service closure ${closure._id} has no service!`);
          continue;
        }
        await insertNewTempServiceClosure({
          startDate: closure.dateDebut,
          endDate: closure.dateFin,
          nbDays: closure.nbDays,
          place: place._id,
          serviceObjectId: closure.serviceObjectId,
        });
      } else {
        for (const service of place.services_all) {
          await insertNewTempServiceClosure({
            startDate: closure.dateDebut,
            endDate: closure.dateFin,
            nbDays: closure.nbDays,
            place: place._id,
            serviceObjectId: service.serviceObjectId,
          });
        }
      }
    }
  }

  next();
};
