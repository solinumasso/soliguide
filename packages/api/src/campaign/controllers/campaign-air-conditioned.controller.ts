import { type ApiPlace, PlaceChangesSection } from "@soliguide/common";

import type { ModelWithId, UserForLogs } from "../../_models";
import type { PlaceChanges } from "../../place-changes/interfaces/PlaceChanges.interface";
import { savePatchChanges } from "../../place-changes/controllers/place-changes.controller";
import {
  updatePlaceByPlaceId,
  updateServices,
} from "../../place/services/admin-place.service";

export const updateAirConditionedForPlace = async (
  oldPlace: ModelWithId<ApiPlace>,
  airConditioned: boolean | null,
  userForLogs: UserForLogs
): Promise<{
  placeChanges: PlaceChanges | null;
  updatedPlace: ModelWithId<ApiPlace>;
}> => {
  const place = await updatePlaceByPlaceId(
    oldPlace.lieu_id,
    {
      "modalities.thermalComfort.airConditioned": airConditioned,
      "stepsDone.conditions": true,
    },
    true,
    oldPlace.status
  );

  const updatedPlace = await updateServices(place);

  const placeChanges = await savePatchChanges(
    PlaceChangesSection.modalities,
    oldPlace,
    updatedPlace,
    userForLogs,
    true
  );

  return { placeChanges, updatedPlace };
};
