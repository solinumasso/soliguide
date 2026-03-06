import { PlaceStatus } from "@soliguide/common";
import { logger } from "../../../general/logger";

import { PlaceModel } from "../../../place/models/place.model";
import { DEFAULT_PLACES_TO_INCLUDE_FOR_SEARCH } from "../../../search/constants/requests";

export async function setOfflineJob(): Promise<void> {
  logger.info("JOB - SET UN-UPDATED PLACES OFFLINE\tSTART");

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setHours(0);
  sixMonthsAgo.setMinutes(0);
  sixMonthsAgo.setSeconds(0);
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  logger.info("Mise à jour des structures hors ligne");
  const request = {
    ...DEFAULT_PLACES_TO_INCLUDE_FOR_SEARCH,
    status: PlaceStatus.ONLINE,
    updatedByUserAt: { $lt: sixMonthsAgo },
  };

  await PlaceModel.updateMany(request, {
    $set: { status: PlaceStatus.OFFLINE },
  });

  logger.info("JOB - SET UN-UPDATED PLACES OFFLINE\tEND");
}
