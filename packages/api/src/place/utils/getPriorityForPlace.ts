import { CommonNewPlaceService, PlaceStatus } from "@soliguide/common";
import { PRIORITARY_CATEGORIES } from "../../categories/constants/prioritary-categories.const";

export const getPriorityForPlace = (
  services_all: CommonNewPlaceService[],
  status: PlaceStatus
): boolean => {
  const containPriorityService = services_all.reduce(
    (priority: boolean, service: CommonNewPlaceService) =>
      priority ||
      !!(service.category && PRIORITARY_CATEGORIES.includes(service.category)),
    false
  );

  return (
    (status === PlaceStatus.ONLINE || status === PlaceStatus.OFFLINE) &&
    containPriorityService
  );
};
