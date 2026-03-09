import { PlaceStatus } from "@soliguide/common";
import { subMonths, startOfDay } from "date-fns";
import { logger } from "../../../general/logger";

import { PlaceModel } from "../../../place/models/place.model";
import { DEFAULT_PLACES_TO_INCLUDE_FOR_SEARCH } from "../../../search/constants/requests";

export async function setOfflineJob(): Promise<void> {
  logger.info("JOB - SET UN-UPDATED PLACES OFFLINE\tSTART");

  const sixMonthsAgo = startOfDay(subMonths(new Date(), 6));

  const request = {
    ...DEFAULT_PLACES_TO_INCLUDE_FOR_SEARCH,
    status: PlaceStatus.ONLINE,
    updatedByUserAt: { $lt: sixMonthsAgo },
  };

  const result = await PlaceModel.updateMany(
    request,
    { $set: { status: PlaceStatus.OFFLINE } },
    { timestamps: false }
  );

  logger.info(`${result.modifiedCount} places set to OFFLINE`);

  logger.info("JOB - SET UN-UPDATED PLACES OFFLINE\tEND");
}
