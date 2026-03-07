import { TempInfoStatus, TempInfoType } from "@soliguide/common";
import type { TempInfoObject } from "../../../_models";
import { PlaceModel } from "./../../../place/models/place.model";
import { logger } from "../../../general/logger";
import { TempInfoModel } from "../../../temp-info/models/temp-info.model";

export async function setCurrentTempInfoJob(): Promise<void> {
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
          arrayFilters: [{ "elem.serviceObjectId": tempInfos.serviceObjectId }],
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

  logger.info("JOB - SET CURRENT TEMPORARY INFORMATION FOR PLACES - END");
}
