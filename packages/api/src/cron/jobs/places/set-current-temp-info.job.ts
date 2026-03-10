import {
  BasePlaceTempInfo,
  TempInfoStatus,
  TempInfoType,
} from "@soliguide/common";
import { PlaceModel } from "./../../../place/models/place.model";
import { logger } from "../../../general/logger";
import { TempInfoModel } from "../../../temp-info/models/temp-info.model";

const BATCH_SIZE = 500;

export async function setCurrentTempInfoJob(): Promise<void> {
  logger.info("JOB - SET CURRENT TEMPORARY INFORMATION FOR PLACES - START");

  //
  // 0. Clean up stale FUTURE records whose dateDebut is already in the past
  //    These records missed their activation window and would otherwise accumulate forever
  //
  const staleResult = await TempInfoModel.updateMany(
    {
      status: TempInfoStatus.FUTURE,
      dateDebut: { $lt: new Date() },
    },
    { $set: { status: TempInfoStatus.OBSOLETE } }
  );

  if (staleResult.modifiedCount) {
    logger.info(
      `${staleResult.modifiedCount} stale FUTURE temp infos marked as OBSOLETE`
    );
  }

  //
  // 1. Search for future info which can go to places in the temporary information table
  //    Uses a cursor to avoid loading all results into memory at once
  //
  const now = new Date();
  const maxDateDebut = new Date(now);
  maxDateDebut.setDate(maxDateDebut.getDate() + 15);

  const cursor = TempInfoModel.aggregate([
    {
      $match: {
        status: TempInfoStatus.FUTURE,
        dateDebut: { $gte: now, $lte: maxDateDebut },
      },
    },
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
  ]).cursor();

  //
  // 2. Populate these temporary info in the matching places (batched)
  //

  let placeBulkQuery: any[] = [];
  let tempInfoBulkQuery: any[] = [];
  let totalProcessed = 0;

  for await (const tempInfos of cursor) {
    const basicContent: Partial<BasePlaceTempInfo> = {
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

    // Flush batch when reaching BATCH_SIZE
    if (placeBulkQuery.length >= BATCH_SIZE) {
      await PlaceModel.bulkWrite(placeBulkQuery);
      await TempInfoModel.bulkWrite(tempInfoBulkQuery);
      totalProcessed += placeBulkQuery.length;
      placeBulkQuery = [];
      tempInfoBulkQuery = [];
    }
  }

  // Flush remaining operations
  if (placeBulkQuery.length) {
    await PlaceModel.bulkWrite(placeBulkQuery);
    await TempInfoModel.bulkWrite(tempInfoBulkQuery);
    totalProcessed += placeBulkQuery.length;
  }

  logger.info(
    `${totalProcessed} Current temporary info populated in the places`
  );

  logger.info("JOB - SET CURRENT TEMPORARY INFORMATION FOR PLACES - END");
}
