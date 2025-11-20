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
import delay from "delay";
import { parentPort } from "worker_threads";

import { TempInfoStatus, TempInfoType } from "@soliguide/common";

import "../../../config/database/connection";

import type { TempInfoObject } from "../../../_models";
import { PlaceModel } from "./../../../place/models/place.model";
import { logger } from "../../../general/logger";
import { TempInfoModel } from "../../../temp-info/models/temp-info.model";

(async () => {
  try {
    logger.info("JOB - SET CURRENT TEMPORARY INFORMATION FOR PLACES - START");

    //
    // 1. Search for future info which can go to places in the temporary information table
    //
    const futureTempInfos = await TempInfoModel.aggregate([
      { $match: { status: TempInfoStatus.FUTURE } },
      {
        $addFields: {
          isCurrent: {
            $dateDiff: {
              endDate: "$dateDebut",
              startDate: new Date(),
              unit: "day",
            },
          },
        },
      },
      { $match: { isCurrent: { $gte: 0, $lte: 15 } } },
      { $sort: { dateDebut: 1 } },
      {
        $group: {
          _id: {
            $concat: [
              {
                $cond: [
                  { $ne: ["$serviceObjectId", null] },
                  { $toString: "$serviceObjectId" },
                  { $toString: "$placeId" },
                ],
              },
              "-",
              "$tempInfoType",
            ],
          },
          dateDebut: { $first: "$dateDebut" },
          dateFin: { $first: "$dateFin" },
          description: { $first: "$description" },
          hours: { $first: "$hours" },
          name: { $first: "$name" },
          placeId: { $first: "$placeId" },
          serviceObjectId: { $first: "$serviceObjectId" },
          tempInfosObjectId: { $first: "$_id" },
          tempInfoType: { $first: "$tempInfoType" },
        },
      },
    ]);

    //
    // 2. Populate these temporary info in the matching places
    //

    const placeBulkQuery: any[] = [];
    const tempInfoBulkQuery = [];

    for (const tempInfos of futureTempInfos) {
      const basicContent: TempInfoObject = {
        actif: true,
        dateDebut: tempInfos.dateDebut,
        dateFin: tempInfos.dateFin,
      };

      const tempInfoType = tempInfos.tempInfoType;

      if (tempInfoType === TempInfoType.SERVICE_CLOSURE) {
        placeBulkQuery.push({
          updateOne: {
            arrayFilters: [
              { "elem.serviceObjectId": tempInfos.serviceObjectId },
            ],
            filter: { lieu_id: tempInfos.placeId },
            timestamps: false,
            update: { $set: { "services_all.$[elem].close": basicContent } },
          },
        });
      } else {
        basicContent["description"] = tempInfos.description;

        if (tempInfoType === TempInfoType.HOURS) {
          basicContent["hours"] = tempInfos.hours;
        } else if (tempInfoType === TempInfoType.MESSAGE) {
          basicContent["name"] = tempInfos.name;
        }

        placeBulkQuery.push({
          updateOne: {
            filter: { lieu_id: tempInfos.placeId },
            timestamps: false,
            update: {
              $set: {
                [`tempInfos.${tempInfoType}`]: basicContent,
              },
            },
          },
        });
      }

      tempInfoBulkQuery.push({
        updateOne: {
          filter: { _id: tempInfos.tempInfosObjectId },
          timestamps: false,
          update: { $set: { status: TempInfoStatus.CURRENT } },
        },
      });
    }

    if (placeBulkQuery.length) {
      await PlaceModel.bulkWrite(placeBulkQuery);
    }

    if (tempInfoBulkQuery.length) {
      await TempInfoModel.bulkWrite(tempInfoBulkQuery);
    }

    logger.info(
      `${placeBulkQuery.length} Current temporary info populated in the places`
    );

    await delay(500);

    logger.info("JOB - SET CURRENT TEMPORARY INFORMATION FOR PLACES - END");
  } catch (e) {
    logger.error(e);
    if (parentPort) parentPort.postMessage("Error while running job");
  }

  if (parentPort) parentPort.postMessage("done");
})();
