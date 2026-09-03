import { PlaceStatus, PlaceVisibility } from "@soliguide/common";

/**
 * Constraints applied when reading a place from the public API.
 *
 * This deliberately describes the data that may be read, rather than the
 * kind of user making the request.
 */
export type PlaceAccessQuery = {
  status: PlaceStatus;
  visibility?: PlaceVisibility;
};
