import { PlaceStatus, PlaceType } from "../enums";
import { ApiPlace } from "../interfaces";

export const isDraftAndFormUncomplete = (
  place: Pick<ApiPlace, "status" | "stepsDone" | "placeType">
): boolean => {
  return (
    place.status === PlaceStatus.DRAFT &&
    (!place.stepsDone.emplacement ||
      !place.stepsDone.publics ||
      !place.stepsDone.conditions ||
      !place.stepsDone.services ||
      (place.placeType === PlaceType.PLACE && !place.stepsDone.horaires))
  );
};
