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
  TempInfoType,
  TempInfoStatus,
  type ApiPlace,
  type CommonNewPlaceService,
  type TempInfo as CommonTempInfo,
} from "@soliguide/common";

import mongoose, { type FilterQuery } from "mongoose";
import { differenceInCalendarDays, subDays } from "date-fns";

import { TempInfoModel } from "../models/temp-info.model";
import { PLACE_FIELDS_FOR_USERS } from "../../user/constants/FIELDS_TO_SELECT_FOR_POPULATE.const";
import type { UpComingTempInfo } from "../../autoexport/types";
import type {
  MinimalInputTempInfo,
  PopulatedTempInfo,
  TempInfo,
} from "../types";
import type { ModelWithId } from "../../_models";

export const buildTempInfo = (
  tempInfo: Pick<CommonTempInfo, "dateFin" | "dateDebut" | "tempInfoType">,
  place: ModelWithId<ApiPlace>,
  service?: CommonNewPlaceService
) => {
  const now = new Date();

  const dateFin = tempInfo.dateFin ? tempInfo.dateFin : null;

  const nbDays = tempInfo.dateFin
    ? differenceInCalendarDays(tempInfo.dateFin, tempInfo.dateDebut)
    : null;

  const placeObjectId = new mongoose.Types.ObjectId(place._id);
  const placeId = place.lieu_id;

  const serviceObjectId = service
    ? new mongoose.Types.ObjectId(service.serviceObjectId)
    : null;

  const isActif = !tempInfo.dateFin || now <= tempInfo.dateFin;
  const isCurrent = isActif && subDays(tempInfo.dateDebut, 15) <= now;

  const status = isActif
    ? isCurrent
      ? TempInfoStatus.CURRENT
      : TempInfoStatus.FUTURE
    : TempInfoStatus.OBSOLETE;

  const newTempInfo:
    | Pick<
        TempInfo,
        | "place"
        | "placeId"
        | "serviceObjectId"
        | "nbDays"
        | "status"
        | "tempInfoType"
        | "dateDebut"
        | "dateFin"
      > &
        Partial<Pick<TempInfo, "name" | "hours">> = {
    place: placeObjectId,
    placeId,
    serviceObjectId,
    nbDays,
    status,
    tempInfoType: tempInfo.tempInfoType,
    dateDebut: tempInfo.dateDebut,
    dateFin: dateFin,
  };
  if (
    [
      TempInfoType.CLOSURE,
      TempInfoType.HOURS,
      TempInfoType.SERVICE_CLOSURE,
    ].includes(tempInfo.tempInfoType)
  ) {
    newTempInfo.name = null;
  }
  if (
    [
      TempInfoType.CLOSURE,
      TempInfoType.MESSAGE,
      TempInfoType.SERVICE_CLOSURE,
    ].includes(tempInfo.tempInfoType)
  ) {
    newTempInfo.hours = null;
  }
  return newTempInfo;
};

export const saveTempInfo = (
  tempInfo: MinimalInputTempInfo | TempInfo
): Promise<TempInfo> => {
  return new TempInfoModel(tempInfo).save();
};

export const updateTempInfoWithParams = (
  params: FilterQuery<TempInfo>,
  content: Partial<TempInfo>
): Promise<TempInfo | null> => {
  if (params._id) {
    params._id = new mongoose.Types.ObjectId(params._id);
  }

  return TempInfoModel.findOneAndUpdate(
    params,
    { $set: content },
    { new: true }
  )
    .populate({
      path: "place",
      select: PLACE_FIELDS_FOR_USERS,
    })
    .lean()
    .exec();
};

export const findTempInfoWithParams = (
  params: FilterQuery<TempInfo | CommonTempInfo | PopulatedTempInfo>
): Promise<PopulatedTempInfo[]> => {
  if (params._id && typeof params._id === "string") {
    params._id = new mongoose.Types.ObjectId(params._id);
  }

  if (params.place && typeof params.place === "string") {
    params.place = new mongoose.Types.ObjectId(params.place);
  }

  if (params.serviceObjectId && typeof params.serviceObjectId === "string") {
    params.serviceObjectId = new mongoose.Types.ObjectId(
      params.serviceObjectId
    );
  }

  return TempInfoModel.find(params)
    .sort({ dateDebut: 1 })
    .populate({
      path: "place",
      select: PLACE_FIELDS_FOR_USERS,
    })
    .lean<PopulatedTempInfo[]>()
    .exec();
};

export const deleteTempInfoByParams = async (
  params: FilterQuery<TempInfo>,
  unique = true
): Promise<PopulatedTempInfo | null> => {
  if (params._id && typeof params._id === "string") {
    params._id = new mongoose.Types.ObjectId(params._id);
  }

  if (params.place && typeof params.place === "string") {
    params.place = new mongoose.Types.ObjectId(params.place);
  }

  if (params.serviceObjectId && typeof params.serviceObjectId === "string") {
    params.serviceObjectId = new mongoose.Types.ObjectId(
      params.serviceObjectId
    );
  }

  if (params._id || unique) {
    return TempInfoModel.findOneAndDelete<TempInfo>(params)
      .populate({
        path: "place",
        select: PLACE_FIELDS_FOR_USERS,
      })
      .lean<PopulatedTempInfo>()
      .exec();
  }
  await TempInfoModel.deleteMany(params);
  return null;
};

export const getUpcomingTempInfo = (
  placesIds: number[]
): Promise<UpComingTempInfo> => {
  const twoMonthsLater = new Date();
  twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);
  return TempInfoModel.aggregate([
    {
      $match: {
        $or: [
          { dateFin: null },
          { dateDebut: { $lt: twoMonthsLater }, dateFin: { $gt: new Date() } },
        ],
        placeId: { $in: placesIds },
        tempInfoType: { $ne: TempInfoType.SERVICE_CLOSURE },
      },
    },
    {
      $group: {
        _id: "$placeId",
        tempInfo: { $push: "$$ROOT" },
      },
    },
    {
      $project: {
        placeId: "$_id",
        tempInfo: 1,
        _id: 0,
      },
    },
    {
      $sort: {
        placeId: 1,
      },
    },
  ]).exec();
};
