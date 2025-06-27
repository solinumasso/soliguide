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
import mongoose, { FilterQuery } from "mongoose";
import { addDays, startOfDay, startOfToday } from "date-fns";

import {
  type ApiPlace,
  PlaceStatus,
  TempInfoType,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
  SoliguideCountries,
} from "@soliguide/common";

import { PlaceModel } from "../models/place.model";
import { TranslatedPlaceModel } from "../../translations/models";
import { updateServicesAfterPatch, isPlaceOpenToday } from "../utils";
import type { ModelWithId } from "../../_models";
import { findTempInfoWithParams } from "../../temp-info/services/temp-info.service";
import { getPlaceByParams } from "./place.service";

export const addNewPlace = async (
  place: Partial<ApiPlace>
): Promise<ModelWithId<ApiPlace>> => {
  const newPlace = await new PlaceModel(place).save();

  const sourceLanguage =
    SUPPORTED_LANGUAGES_BY_COUNTRY[place.country as SoliguideCountries].source;

  await new TranslatedPlaceModel({
    lieu_id: newPlace.lieu_id,
    placeObjectId: new mongoose.Types.ObjectId(newPlace._id),
    sourceLanguage,
    position: {
      country: place.country as SoliguideCountries,
      departmentCode: null,
      regionCode: null,
    },
  }).save();

  return newPlace as unknown as ModelWithId<ApiPlace>;
};

export const getNextPlaceId = async (): Promise<number> => {
  const lastPlace = await PlaceModel.findOne().sort({ lieu_id: -1 }).exec();
  return lastPlace ? lastPlace.lieu_id + 1 : 1;
};

export const updatePlaceUpdatedAtByPlaceId = async (lieu_id: number) => {
  await PlaceModel.updateOne(
    { lieu_id },
    { $set: { updatedByUserAt: new Date() } }
  ).exec();
};

export const updatePlaceByPlaceId = async (
  lieu_id: number,
  data: FilterQuery<ApiPlace>,
  forceChanges = true,
  status = PlaceStatus.ONLINE
): Promise<ModelWithId<ApiPlace>> => {
  if (forceChanges) {
    if (status === PlaceStatus.OFFLINE) {
      data.status = PlaceStatus.ONLINE;
    }

    await PlaceModel.updateOne(
      { lieu_id },
      {
        $set: { ...data, updatedByUserAt: new Date() },
      }
    ).exec();
  } else {
    await PlaceModel.updateOne(
      { lieu_id },
      {
        $set: { ...data },
      }
    ).exec();
  }

  const result = await getPlaceByParams({ lieu_id });
  if (!result) {
    throw new Error("PLACE_DOES_NOT_EXIST");
  }
  return result;
};

/**
 * @summary  Update services with the same welcomed publics, opening hours or access conditions than the place
 * @param {Object} place - place
 */
export const updateServices = async (
  place: ModelWithId<ApiPlace>,
  forceChanges = true
): Promise<ModelWithId<ApiPlace>> => {
  const updatedServices = await updateServicesAfterPatch(place);
  return updatePlaceByPlaceId(
    place.lieu_id,
    { services_all: updatedServices },
    forceChanges,
    place.status
  );
};

export const deletePlaceById = async (
  _id: mongoose.Types.ObjectId
): Promise<void> => {
  await PlaceModel.deleteOne({
    _id,
  });
};

export const updateTempInfos = async (
  place: ApiPlace,
  tempInfoType: TempInfoType
): Promise<ModelWithId<ApiPlace>> => {
  const newPlaceStatus =
    place.status === PlaceStatus.OFFLINE ? PlaceStatus.ONLINE : place.status;

  // We look for the other temporary information
  const twoWeeksAgo = addDays(startOfDay(new Date()), 16);

  const currentTempInfos = await findTempInfoWithParams({
    $or: [
      { dateDebut: { $lte: twoWeeksAgo }, dateFin: null },
      {
        dateDebut: { $lte: twoWeeksAgo },
        dateFin: { $exists: true, $gte: startOfToday(), $ne: null },
      },
    ],
    placeId: place.lieu_id,
    tempInfoType,
  });

  place.tempInfos[tempInfoType] = {
    actif: false,
    dateDebut: null,
    dateFin: null,
    description: null,
    hours: null,
    name: null,
  };

  if (currentTempInfos?.length) {
    const firstCurrentTempInfo = currentTempInfos[0];

    place.tempInfos[tempInfoType] = {
      actif: true,
      dateDebut: firstCurrentTempInfo.dateDebut,
      dateFin: firstCurrentTempInfo.dateFin,
      description: firstCurrentTempInfo.description,
    };

    if (tempInfoType === TempInfoType.HOURS) {
      place.tempInfos[tempInfoType].hours = firstCurrentTempInfo.hours;
      place.tempInfos[tempInfoType].name = null;
    } else if (tempInfoType === TempInfoType.MESSAGE) {
      place.tempInfos[tempInfoType].name = firstCurrentTempInfo.name;
      place.tempInfos[tempInfoType].hours = null;
    } else {
      place.tempInfos[tempInfoType].name = null;
    }
  } else {
    if (
      tempInfoType === TempInfoType.HOURS ||
      tempInfoType === TempInfoType.MESSAGE
    ) {
      place.tempInfos[tempInfoType].name = null;
    }
    if (
      tempInfoType === TempInfoType.MESSAGE ||
      tempInfoType === TempInfoType.CLOSURE
    ) {
      place.tempInfos[tempInfoType].hours = null;
    }
  }

  if (tempInfoType !== TempInfoType.MESSAGE) {
    place.isOpenToday = await isPlaceOpenToday(place);
  }

  return updatePlaceByPlaceId(place.lieu_id, {
    isOpenToday: place.isOpenToday,
    status: newPlaceStatus,
    tempInfos: place.tempInfos,
  });
};
