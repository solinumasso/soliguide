import { SearchFilterUpdatedAt, UpdatedAtInterval } from "@soliguide/common";

export const parseUpdatedAt = (
  searchUpdatedAt: SearchFilterUpdatedAt,
  nosqlQuery: any
): void => {
  // we don't need to use startOfDay, because frontend do it before
  if (!searchUpdatedAt.value) {
    return;
  }
  if (typeof searchUpdatedAt.value === "string") {
    searchUpdatedAt.value = new Date(searchUpdatedAt.value);
  }

  if (searchUpdatedAt.intervalType === UpdatedAtInterval.SPECIFIC_DAY) {
    const endOfDay = new Date(searchUpdatedAt.value);
    endOfDay.setUTCHours(23, 59, 59, 999);

    nosqlQuery.updatedByUserAt = {
      $gte: searchUpdatedAt.value,
      $lte: endOfDay,
    };
  } else if (searchUpdatedAt.intervalType === UpdatedAtInterval.BEFORE_DAY) {
    nosqlQuery["updatedByUserAt"] = {
      $lte: searchUpdatedAt.value,
    };
  } else if (searchUpdatedAt.intervalType === UpdatedAtInterval.AFTER_DAY) {
    nosqlQuery["updatedByUserAt"] = {
      $gte: searchUpdatedAt.value,
    };
  }
};
