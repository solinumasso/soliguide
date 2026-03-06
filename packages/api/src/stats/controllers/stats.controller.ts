import { PlaceStatus } from "@soliguide/common";

import * as StatsService from "../services/stats.service";

export const countAllPlaces = async (): Promise<number> => {
  return await StatsService.countPlacesWithParams({
    status: { $nin: [PlaceStatus.PERMANENTLY_CLOSED, PlaceStatus.DRAFT] },
  });
};

export const countAllServices = async (): Promise<number> => {
  const result = await StatsService.countServicesWithParams({
    services_all: { $exists: true },
    status: { $nin: [PlaceStatus.PERMANENTLY_CLOSED, PlaceStatus.DRAFT] },
  });

  return result?.length ? result[0].count : 0;
};
