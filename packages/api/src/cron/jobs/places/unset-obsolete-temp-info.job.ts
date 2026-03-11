import {
  BasePlaceTempInfo,
  TempInfoStatus,
  TempInfoType,
} from "@soliguide/common";
import { logger } from "../../../general/logger";
import { PlaceModel } from "../../../place/models/place.model";
import { TempInfoModel } from "../../../temp-info/models/temp-info.model";
import { TranslatedFieldModel } from "../../../translations/models/translatedField.model";

const BATCH_SIZE = 500;

export async function unsetObsoleteTempInfoJob(): Promise<void> {
  logger.info("JOB - UNSET OBSOLETE TEMPORARY INFORMATION FOR PLACES - START");

  //
  // 1. Search for currently obsolete info on places in the temporary info table
  //    Uses a cursor to avoid loading all results into memory at once
  //
  const cursor = TempInfoModel.find({
    status: TempInfoStatus.CURRENT,
    dateFin: { $lt: new Date(), $ne: null },
  })
    .lean()
    .cursor();

  //
  // 2. Cleaning up these temporary info in the matching places (batched)
  //
  let placeBulkQuery: any[] = [];
  let tempInfoBulkQuery: any[] = [];
  let translationBulkQuery: any[] = [];
  let totalProcessed = 0;

  for await (const tempInfos of cursor) {
    const basicCleaning: Partial<BasePlaceTempInfo> = {
      actif: false,
      dateDebut: null,
      dateFin: null,
    };

    if (tempInfos.serviceObjectId) {
      placeBulkQuery.push({
        updateOne: {
          arrayFilters: [{ "elem.serviceObjectId": tempInfos.serviceObjectId }],
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

    // Flush batch when reaching BATCH_SIZE
    if (tempInfoBulkQuery.length >= BATCH_SIZE) {
      await PlaceModel.bulkWrite(placeBulkQuery);
      await TempInfoModel.bulkWrite(tempInfoBulkQuery);
      if (translationBulkQuery.length) {
        await TranslatedFieldModel.bulkWrite(translationBulkQuery);
      }
      totalProcessed += tempInfoBulkQuery.length;
      placeBulkQuery = [];
      tempInfoBulkQuery = [];
      translationBulkQuery = [];
    }
  }

  // Flush remaining operations
  if (tempInfoBulkQuery.length) {
    await PlaceModel.bulkWrite(placeBulkQuery);
    await TempInfoModel.bulkWrite(tempInfoBulkQuery);
    if (translationBulkQuery.length) {
      await TranslatedFieldModel.bulkWrite(translationBulkQuery);
    }
    totalProcessed += tempInfoBulkQuery.length;
  }

  logger.info(`${totalProcessed} Obsolete temporary info cleaned up`);

  logger.info("JOB - UNSET OBSOLETE TEMPORARY INFORMATION FOR PLACES - END");
}
