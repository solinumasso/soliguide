import { differenceInMonths } from "date-fns";
import { UpdatedAtColor } from "../types";

export const getUpdatedAtColor = (updatedAt: Date): UpdatedAtColor => {
  if (!updatedAt) {
    return "danger";
  }

  const dateReference = new Date();

  const dateDiff: number = differenceInMonths(dateReference, updatedAt);

  if (dateDiff <= 3) {
    return "success";
  }

  if (dateDiff > 3 && dateDiff < 6) {
    return "warning";
  }

  return "danger";
};
