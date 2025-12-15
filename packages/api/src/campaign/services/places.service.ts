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
  ApiPlace,
  CAMPAIGN_DEFAULT_NAME,
  CAMPAIGN_LIST,
  EXTERNAL_UPDATES_ONLY_SOURCES,
  PlaceStatus,
} from "@soliguide/common";

import mongoose, { FilterQuery } from "mongoose";

import { PlaceModel } from "../../place/models/place.model";

/**
 *
 * @returns Places to not update during a campaign
 */
export const findPlacesToExclude = async (): Promise<number[]> => {
  const placesIds = await PlaceModel.aggregate([
    {
      $match: {
        $or: [
          {
            status: {
              $in: [PlaceStatus.PERMANENTLY_CLOSED, PlaceStatus.DRAFT],
            },
          },
          {
            $or: [
              { "sources.name": { $in: EXTERNAL_UPDATES_ONLY_SOURCES } },
              { "sources.isOrigin": true },
            ],
          },
        ],
      },
    },
    {
      $group: {
        _id: false,
        lieux: { $addToSet: "$lieu_id" },
      },
    },
  ]).exec();

  return placesIds[0]?.lieux || [];
};

/**
 *
 * @param params Other parameters to refine the search
 * @returns Places to update during a campaign
 */
export const findPlacesToUpdateWithParams = async (
  params: FilterQuery<ApiPlace> | null = null
): Promise<number[]> => {
  const runningCampaign = CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME];
  // Specific criteria to search which places need to be updated
  const campaignParams = runningCampaign.placesToUpdate;
  // List of places which don't need to be updated
  const placesToExclude = await findPlacesToExclude();

  const placesIds = await PlaceModel.aggregate([
    {
      $match: {
        $and: [
          { ...(params ? params : null) },
          { ...(campaignParams ? campaignParams : null) },
          { lieu_id: { $nin: placesToExclude } },
        ],
      },
    },
    {
      $group: {
        _id: false,
        placesId: { $addToSet: "$lieu_id" },
      },
    },
  ]).exec();

  return placesIds[0]?.placesId || [];
};

/**
 *
 * @param {Number} lieu_id Place ID
 * @returns Boolean to know if the place has to be updated during the running campaign
 */
export const isPlaceToUpdate = async (lieu_id: number): Promise<boolean> => {
  const placesToUpdate = await findPlacesToUpdateWithParams({
    lieu_id,
  });
  return placesToUpdate.length > 0;
};

/**
 *
 * @param {Array} placeObjectIds Array of ObjectIds
 * @returns Number of places to update among the list of transmitted places
 */
export const getNbPlacesToUpdate = async (
  placeObjectIds: (string | mongoose.Types.ObjectId)[]
) => {
  const objectIds = placeObjectIds.map(
    (_id: string | mongoose.Types.ObjectId) => new mongoose.Types.ObjectId(_id)
  );
  const nbPlacesToUpdate = await PlaceModel.countDocuments({
    _id: { $in: objectIds },
    [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: true,
  }).exec();

  return nbPlacesToUpdate;
};

export const getNbPriorityPlaces = async (
  placeObjectIds: (string | mongoose.Types.ObjectId)[]
) => {
  const objectIds = placeObjectIds.map(
    (_id: string | mongoose.Types.ObjectId) => new mongoose.Types.ObjectId(_id)
  );

  const nbPriorityPlaces = await PlaceModel.countDocuments({
    _id: { $in: objectIds },
    priority: true,
  }).exec();

  return nbPriorityPlaces;
};
