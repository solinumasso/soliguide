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
  PlaceStatus,
  UserStatus,
  DEFAULT_SERVICES_TO_EXCLUDE,
  ApiPlace,
  CountryCodes,
} from "@soliguide/common";

import { NextFunction } from "express";

import mongoose, { FilterQuery, Model } from "mongoose";

import { getEntityIdName } from "../utils/airtableEntity.function";

import {
  AirtableEntity,
  AirtableEntityType,
  ExpressRequest,
  ExpressResponse,
  User,
} from "../../_models";

import { UserModel } from "../../user/models/user.model";
import { PlaceModel } from "../../place/models/place.model";

export const updateAirtableId = async (
  airtableEntityType: AirtableEntityType,
  entityId: number,
  airtableId: string
): Promise<void> => {
  if (airtableEntityType === AirtableEntityType.PLACE) {
    await PlaceModel.updateOne(
      { [getEntityIdName(airtableEntityType)]: entityId },
      { "atSync.airtableId": airtableId },
      { timestamps: false }
    );
  } else if (airtableEntityType === AirtableEntityType.USER) {
    await UserModel.updateOne(
      { [getEntityIdName(airtableEntityType)]: entityId },
      { "atSync.airtableId": airtableId },
      { timestamps: false }
    );
  } else {
    throw new Error("WRONG_ENTITY_TYPE");
  }
};

export const setSynced = async (
  airtableEntityType: AirtableEntityType,
  entityIds: number[],
  now: Date
): Promise<void> => {
  let model: Model<ApiPlace> | Model<User>;

  if (airtableEntityType === AirtableEntityType.PLACE) {
    model = PlaceModel;
  } else if (airtableEntityType === AirtableEntityType.USER) {
    model = UserModel;
  } else {
    throw new Error("WRONG_ENTITY_TYPE");
  }

  await model.updateMany(
    { [getEntityIdName(airtableEntityType)]: { $in: entityIds } },
    { "atSync.lastSync": now },
    { timestamps: false }
  );
};

export const getEntitiesToSync = async (
  airtableEntityType: AirtableEntityType,
  $limit = 10
): Promise<AirtableEntity[]> => {
  const process: any = [];
  const entityIdName = getEntityIdName(airtableEntityType);
  let model: Model<ApiPlace> | Model<User>;
  const $match: FilterQuery<ApiPlace | User> = { "atSync.excluded": false };

  if (airtableEntityType === AirtableEntityType.PLACE) {
    model = PlaceModel;
    $match.$or = [
      { "position.country": CountryCodes.FR },
      { "parcours.position.country": CountryCodes.FR },
    ];
  } else if (airtableEntityType === AirtableEntityType.USER) {
    model = UserModel;
    $match["areas.fr"] = { $exists: true };
  } else {
    throw new Error("WRONG_ENTITY_TYPE");
  }

  const entitiesToCheck = await model.aggregate([
    { $match },
    {
      $project: {
        [entityIdName]: "$" + entityIdName, // skipcq: JS-0246
        toSync: {
          $cond: [
            { $ne: ["$atSync.lastSync", null] },
            {
              $cond: [{ $lte: ["$atSync.lastSync", "$updatedAt"] }, 0, 1],
            },
            0,
          ],
        },
      },
    },
    { $match: { toSync: 0 } },
  ]);

  const entityIds = entitiesToCheck.map((value: any) => value[entityIdName]);

  process.push({ $match: { [entityIdName]: { $in: entityIds } } });

  if (airtableEntityType === AirtableEntityType.PLACE) {
    process.push({
      $lookup: {
        from: "organization",
        localField: "_id",
        foreignField: "places",
        as: "organizations",
      },
    });
  } else if (airtableEntityType === AirtableEntityType.USER) {
    process.push({
      $lookup: {
        from: "organization",
        localField: "organizations",
        foreignField: "_id",
        as: "organizations",
      },
    });
  }

  process.push({ $sort: { updatedAt: 1 } });
  process.push({ $limit });

  return model.aggregate(process).exec();
};

export const setEntityExcludedOrNot = async (
  req: ExpressRequest
): Promise<void> => {
  const airtableEntityType = req.airtableEntityType;
  const airtableEntity = req.airtableEntity;
  let excluded = false;

  if (airtableEntityType === AirtableEntityType.PLACE) {
    excluded =
      (airtableEntity.services_all.length ||
        airtableEntity.status !== PlaceStatus.ONLINE) &&
      airtableEntity.services_all.reduce(
        (acc: boolean, service: any): boolean =>
          acc && DEFAULT_SERVICES_TO_EXCLUDE.includes(service.category),
        true
      );

    await PlaceModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(airtableEntity._id),
      },
      { "atSync.excluded": excluded }
    );
  } else if (airtableEntityType === AirtableEntityType.USER) {
    excluded = airtableEntity.status !== UserStatus.PRO;

    await UserModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(airtableEntity._id),
      },
      { "atSync.excluded": excluded }
    );
  } else {
    throw new Error("WRONG_ENTITY_TYPE");
  }
};

export const setEntityExcludedOrNotAndNext = async (
  req: ExpressRequest,
  _res: ExpressResponse,
  next: NextFunction
): Promise<void> => {
  await setEntityExcludedOrNot(req);
  next();
};

export const setMultipleEntitiesExcludedForSync = async (
  req: ExpressRequest,
  _res: ExpressResponse,
  next: NextFunction
): Promise<void> => {
  if (req.airtableEntities && req.airtableEntityType) {
    for (const airtableEntity of req.airtableEntities) {
      req.airtableEntity = airtableEntity;
      await setEntityExcludedOrNot(req);
    }
  }

  next();
};
