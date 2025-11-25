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
import { type ApiPlace, TempInfoType } from "@soliguide/common";
import { updatePlaceByPlaceId } from "../services/admin-place.service";
import { isServiceOpenToday } from "../utils/isOpenToday";

import {
  patchTempInfoByType,
  removeServiceClosure,
} from "../../temp-info/controllers/temp-info.controller";
import { TEMP_INFO_HISTORY_SECTIONS } from "../../temp-info/constants/TEMP_INFO_TYPE.const";
import { saveTempChanges } from "../../place-changes/controllers/place-changes.controller";
import type { ModelWithId } from "../../_models";
import type { InputTempInfoInServices } from "../../temp-info/types";
import { UserForLogs } from "../../user/interfaces";

// Temporary services closures - During campaigns exclusively
export const patchClosedServices = async (
  servicesClosure: Array<InputTempInfoInServices>,
  place: ModelWithId<ApiPlace>,
  userForLogs: UserForLogs
) => {
  let i = 0;

  const newServices = [];

  for (const service of place.services_all) {
    const newService = { ...service, close: servicesClosure[i] };
    newService.isOpenToday = await isServiceOpenToday(newService, place);

    newServices.push(newService);

    if (newService.close.actif) {
      const tempInfoToUpdate = {
        ...servicesClosure[i],
        tempInfoType: TempInfoType.SERVICE_CLOSURE,
      };

      await patchTempInfoByType(
        tempInfoToUpdate,
        place,
        userForLogs,
        newService
      );
    } else {
      // When we ourselves manually remove a closure
      await removeServiceClosure(newService);
    }

    i++;
  }

  const updatedPlace = await updatePlaceByPlaceId(
    place.lieu_id,
    { services_all: newServices },
    true,
    place.status
  );

  const placeChanges = await saveTempChanges(
    TEMP_INFO_HISTORY_SECTIONS[TempInfoType.SERVICE_CLOSURE],
    place,
    { ...place, services_all: newServices },
    userForLogs,
    false,
    servicesClosure[0].isCampaign
  );

  return { updatedPlace, placeChanges };
};
