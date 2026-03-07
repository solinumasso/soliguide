import { PlaceType } from "../enums";
import type { ApiPlace } from "../interfaces";
import type { CommonPlacePosition } from "../classes";

export const getPosition = (
  place: Pick<ApiPlace, "parcours" | "position" | "placeType">
): CommonPlacePosition | undefined => {
  return place.placeType === PlaceType.PLACE
    ? place.position
    : place.parcours[0]?.position;
};
