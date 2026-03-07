import { TempInfoStatus, TempInfoType } from "@soliguide/common";
import { TempInfoObject } from "../../../_models";
import { logger } from "../../../general/logger";
import { PlaceModel } from "../../../place/models/place.model";
import { TempInfoModel } from "../../../temp-info/models/temp-info.model";
import { TranslatedFieldModel } from "../../../translations/models/translatedField.model";

export async function unsetObsoleteTempInfoJob(): Promise<void> {
  logger.info("JOB - UNSET OBSOLETE TEMPORARY INFORMATION FOR PLACES - START");

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

  logger.info("JOB - UNSET OBSOLETE TEMPORARY INFORMATION FOR PLACES - END");
}
