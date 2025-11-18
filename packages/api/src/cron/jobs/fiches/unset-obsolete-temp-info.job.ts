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

import { TempInfoObject } from "../../../_models";
import { logger } from "../../../general/logger";
import { PlaceModel } from "../../../place/models/place.model";
import { TempInfoModel } from "../../../temp-info/models/temp-info.model";
import { TranslatedFieldModel } from "../../../translations/models/translatedField.model";

(async () => {
  try {
    logger.info(
      "JOB - UNSET OBSOLETE TEMPORARY INFORMATION FOR PLACES - START"
    );

    //
    // 1. Search for currently obsolete info on places in the temporary info table
    //
    const obsoleteTempInfos = await TempInfoModel.find({
      dateFin: { $exists: true, $lt: new Date(), $ne: null },
      status: TempInfoStatus.CURRENT,
    })
      .lean()
      .exec();

    //
    // 2. Cleaning up these temporary info in the matching places
    //
    const placeBulkQuery: any = [];
    const tempInfoBulkQuery = [];
    const translationBulkQuery: any = [];

    for (const tempInfos of obsoleteTempInfos) {
      const basicCleaning: TempInfoObject = {
        actif: false,
        dateDebut: null,
        dateFin: null,
      };

      if (tempInfos.serviceObjectId) {
        placeBulkQuery.push({
          updateOne: {
            arrayFilters: [
              { "elem.serviceObjectId": tempInfos.serviceObjectId },
            ],
            filter: { lieu_id: tempInfos.placeId },
            timestamps: false,
            update: { $set: { "services_all.$[elem].close": basicCleaning } },
          },
        });
      } else {
        const tempInfoType = tempInfos.tempInfoType.toLowerCase();

        basicCleaning.description = "";

        if (tempInfoType === TempInfoType.HOURS) {
          basicCleaning.hours = null;
        } else if (tempInfoType === TempInfoType.MESSAGE) {
          basicCleaning.name = "";
        }

        placeBulkQuery.push({
          updateOne: {
            filter: { lieu_id: tempInfos.placeId },
            timestamps: false,
            update: {
              $set: {
                [`tempInfos.${tempInfoType}`]: basicCleaning,
              },
            },
          },
        });

        // There is no description on service closures, that's why we don't need to disable a translation
        translationBulkQuery.push({
          deleteOne: {
            filter: {
              elementName: `tempInfos.${tempInfoType}.description`,
              lieu_id: tempInfos.placeId,
            },
          },
        });
      }

      tempInfoBulkQuery.push({
        updateOne: {
          filter: { _id: tempInfos._id },
          timestamps: false,
          update: { $set: { status: TempInfoStatus.OBSOLETE } },
        },
      });
    }

    if (placeBulkQuery.length) {
      await PlaceModel.bulkWrite(placeBulkQuery);
    }

    if (tempInfoBulkQuery.length) {
      await TempInfoModel.bulkWrite(tempInfoBulkQuery);
    }

    if (translationBulkQuery.length) {
      await TranslatedFieldModel.bulkWrite(translationBulkQuery);
    }

    logger.info(`${placeBulkQuery.length} Obsolete temporary info cleaned up`);

    await delay(500);

    logger.info("JOB - UNSET OBSOLETE TEMPORARY INFORMATION FOR PLACES - END");
  } catch (e) {
    logger.error(e);
    if (parentPort) parentPort.postMessage("Error while running job");
  }

  if (parentPort) parentPort.postMessage("done");
})();
