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
import type { FilterQuery } from "mongoose";

import {
  type ApiPlace,
  type CommonNewPlaceService,
  PlaceChangesSection,
  TempInfoStatus,
  TempInfoType,
  type CampaignChangesSection,
} from "@soliguide/common";

import { TEMP_INFO_HISTORY_SECTIONS } from "../constants/TEMP_INFO_TYPE.const";

import type { ModelWithId } from "../../_models";

import { isCampaignActiveForPlace } from "../../campaign/controllers/campaign.controller";
import { computePlaceAutonomyStatus } from "../../campaign/controllers/campaign-stats.controller";
import {
  updateCampaignSection,
  updateOrganizationCampaign,
} from "../../campaign/controllers/campaign-update.controller";

import { saveTempChanges } from "../../place-changes/controllers/place-changes.controller";

import { deleteTempInfoTranslatedFields } from "../../translations/controllers/translation.controller";
import {
  findTempInfoWithParams,
  buildTempInfo,
  updateTempInfoWithParams,
  saveTempInfo,
  deleteTempInfoByParams,
} from "../services/temp-info.service";
import {
  updateServices,
  updateTempInfos,
} from "../../place/services/admin-place.service";
import type { PopulatedTempInfo, TempInfo } from "../types";
import { UserForLogs } from "../../user/interfaces";

export const getTempInfoByType = (
  type: TempInfoType,
  place: Pick<ApiPlace, "lieu_id">
) => {
  return findTempInfoWithParams({
    placeId: place.lieu_id,
    status: { $ne: TempInfoStatus.OBSOLETE },
    tempInfoType: type,
  });
};

export const patchTempInfoByType = async (
  tempInfo:
    | Pick<TempInfo, "dateDebut" | "dateFin" | "tempInfoType"> &
        Partial<Pick<TempInfo, "_id">> & {
          actif: boolean;
          isCampaign: boolean;
        },
  place: ModelWithId<ApiPlace>,
  userForLogs: UserForLogs,
  service?: CommonNewPlaceService
) => {
  const dataToUpdate = {
    ...tempInfo,
    ...buildTempInfo(tempInfo, place, service),
  };

  let updatedTempInfo: TempInfo | null = null;
  let oldTempInfoFromDb: PopulatedTempInfo | null = null;

  let params: FilterQuery<TempInfo> | null = null;

  if (tempInfo._id) {
    params = { _id: tempInfo._id };
  }

  if (service) {
    params ??= {};
    params["serviceObjectId"] = service.serviceObjectId;
  }

  if (params) {
    params["status"] = {
      $in: [TempInfoStatus.CURRENT, TempInfoStatus.FUTURE],
    };

    const tempInfoFromDb = await findTempInfoWithParams(params);

    if (tempInfoFromDb?.length) {
      oldTempInfoFromDb = tempInfoFromDb[0];
    }
  }

  if (dataToUpdate.status !== TempInfoStatus.OBSOLETE) {
    if (oldTempInfoFromDb && params) {
      updatedTempInfo = await updateTempInfoWithParams(params, dataToUpdate);
    } else {
      updatedTempInfo = await saveTempInfo(dataToUpdate);
    }
  }

  let updatedPlace = await updateTempInfos(place, tempInfo.tempInfoType);

  updatedPlace = await updateServices(updatedPlace);

  if (tempInfo.isCampaign) {
    updatedPlace = await updateCampaignSection(
      updatedPlace,
      TEMP_INFO_HISTORY_SECTIONS[
        tempInfo.tempInfoType
      ] as unknown as CampaignChangesSection,
      true
    );
  }

  // We update the autonomy status if necessary when the campaign is on
  if (isCampaignActiveForPlace(updatedPlace)) {
    updatedPlace = await computePlaceAutonomyStatus(updatedPlace, userForLogs);

    await updateOrganizationCampaign(updatedPlace._id);
  }

  let placeChanges;

  if (updatedTempInfo && dataToUpdate.status !== TempInfoStatus.OBSOLETE) {
    const newTempInfo = {
      ...updatedPlace,
      tempInfos: updatedTempInfo,
    };

    const oldTempInfo = {
      ...place,
      tempInfos: oldTempInfoFromDb,
    };

    if (updatedTempInfo.tempInfoType !== TempInfoType.SERVICE_CLOSURE) {
      placeChanges = await saveTempChanges(
        TEMP_INFO_HISTORY_SECTIONS[
          updatedTempInfo.tempInfoType
        ] as PlaceChangesSection,
        oldTempInfo,
        newTempInfo,
        userForLogs,
        false,
        tempInfo.isCampaign
      );
    }
  }

  return { place: updatedPlace, tempInfos: updatedTempInfo, placeChanges };
};

export const deleteTempInfo = async (
  tempInfoId: string,
  tempInfoType: TempInfoType,
  place: ModelWithId<ApiPlace>,
  userForLogs: UserForLogs
) => {
  const tempInfoToDelete = await findTempInfoWithParams({
    _id: tempInfoId,
  });

  if (!tempInfoToDelete?.length) {
    throw new Error("Nothing to delete");
  }

  const deletedTempInfo = await deleteTempInfoByParams({
    _id: tempInfoId,
  });

  const updatedPlace = await updateTempInfos(place, tempInfoType);

  const newTempInfo = {
    ...updatedPlace,
    tempInfos: null,
  };

  const oldTempInfo = {
    ...updatedPlace,
    tempInfos: deletedTempInfo,
  };

  await saveTempChanges(
    TEMP_INFO_HISTORY_SECTIONS[tempInfoType],
    oldTempInfo,
    newTempInfo,
    userForLogs
  );

  await deleteTempInfoTranslatedFields(tempInfoToDelete[0], updatedPlace);

  const tempInfo = await getTempInfoByType(tempInfoType, updatedPlace);

  return { place: updatedPlace, tempInfo };
};

// Temporary function to clean closures in service until multiple closures are enabled in services
export const removeServiceClosure = (
  service: CommonNewPlaceService
): Promise<PopulatedTempInfo | null> => {
  return deleteTempInfoByParams({
    serviceObjectId: service.serviceObjectId,
    status: { $in: [TempInfoStatus.CURRENT, TempInfoStatus.FUTURE] },
  });
};
