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
import mongoose, { type FilterQuery } from "mongoose";
import { differenceInCalendarDays } from "date-fns";

import { type CampaignName, CAMPAIGN_LIST } from "@soliguide/common";

import type { TempServiceClosure } from "../interfaces";
import { TempServiceClosureModel } from "../models/temp-service-closure.model";

const findTempServiceClosureWithParams = async (
  params: FilterQuery<TempServiceClosure>
): Promise<TempServiceClosure[]> => {
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

  return await TempServiceClosureModel.find(params);
};

const findOverlappingTempServiceClosure = async (
  closureToSearch: Pick<
    TempServiceClosure,
    "serviceObjectId" | "startDate" | "endDate"
  >
) => {
  const params: FilterQuery<TempServiceClosure> = {
    serviceObjectId: closureToSearch.serviceObjectId,
  };

  if (closureToSearch.endDate) {
    params.$or = [
      { endDate: null, startDate: { $lte: closureToSearch.endDate } },
      {
        startDate: { $lte: closureToSearch.endDate },
        endDate: { $gte: closureToSearch.startDate, $ne: null },
      },
    ];
  } else {
    params.$or = [
      { endDate: null },
      { endDate: { $gte: closureToSearch.startDate, $ne: null } },
    ];
  }

  return await findTempServiceClosureWithParams(params);
};

export const insertNewTempServiceClosure = async (
  closureToInsert: Pick<
    TempServiceClosure,
    "startDate" | "endDate" | "nbDays" | "place" | "serviceObjectId"
  >
) => {
  // First we search the closures which overlap the one we want to insert
  const overlappingClosures = await findOverlappingTempServiceClosure(
    closureToInsert
  );

  let firstStartDate = closureToInsert.startDate;
  let lastEndDate = closureToInsert.endDate;

  if (overlappingClosures?.length) {
    // If there is overlapping we combine them
    firstStartDate = overlappingClosures.reduce(
      (date: Date, closure: TempServiceClosure) => {
        if (closure.startDate < date) {
          date = closure.startDate;
        }
        return date;
      },
      closureToInsert.startDate
    );

    lastEndDate = closureToInsert.endDate
      ? overlappingClosures.reduce(
          (date: Date | null, closure: TempServiceClosure) => {
            if (date) {
              if (!closure.endDate) {
                date = closure.endDate;
              } else if (closure.endDate > date) {
                date = closure.startDate;
              }
            }
            return date;
          },
          closureToInsert.endDate
        )
      : null;

    await TempServiceClosureModel.deleteMany({
      _id: {
        $in: overlappingClosures.map(
          (closure: TempServiceClosure) => closure._id
        ),
      },
    });
  }

  let campaign: string | null = null;

  for (const campaignName in CAMPAIGN_LIST) {
    if (
      lastEndDate &&
      firstStartDate <= CAMPAIGN_LIST[campaignName as CampaignName].dateFin &&
      CAMPAIGN_LIST[campaignName as CampaignName].dateDebutCampagne <=
        lastEndDate
    ) {
      campaign = campaignName;
    } else if (
      !lastEndDate &&
      firstStartDate <= CAMPAIGN_LIST[campaignName as CampaignName].dateFin
    ) {
      campaign = campaignName;
    }
  }

  await new TempServiceClosureModel({
    ...closureToInsert,
    startDate: firstStartDate,
    endDate: lastEndDate,
    nbDays: lastEndDate
      ? differenceInCalendarDays(lastEndDate, firstStartDate)
      : null,
    campaign,
  }).save();
};

export const deleteTempServiceClosureWithParams = async (
  params: FilterQuery<TempServiceClosure>
) => {
  if (params.place && typeof params.place === "string") {
    params.place = new mongoose.Types.ObjectId(params.place);
  }

  if (params.serviceObjectId && typeof params.serviceObjectId === "string") {
    params.serviceObjectId = new mongoose.Types.ObjectId(
      params.serviceObjectId
    );
  }

  if (params._id) {
    if (typeof params._id === "string") {
      params._id = new mongoose.Types.ObjectId(params._id);
    }

    await TempServiceClosureModel.deleteOne(params).lean().exec();
  } else {
    await TempServiceClosureModel.deleteMany(params).lean().exec();
  }
};
