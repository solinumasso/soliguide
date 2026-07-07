import { PlaceChangesSection, PlaceStatus } from "@soliguide/common";

import type { ApiPlace } from "@soliguide/common";
import type { ModelWithId, UserForLogs } from "../../_models";
import { savePatchChanges } from "../../place-changes/controllers/place-changes.controller";
import {
  updatePlaceByPlaceId,
  updateServices,
} from "../../place/services/admin-place.service";
import { updateAirConditionedForPlace } from "./campaign-air-conditioned.controller";

jest.mock("../../place/services/admin-place.service", () => ({
  updatePlaceByPlaceId: jest.fn(),
  updateServices: jest.fn(),
}));

jest.mock("../../place-changes/controllers/place-changes.controller", () => ({
  savePatchChanges: jest.fn(),
}));

const updatePlaceByPlaceIdMock = updatePlaceByPlaceId as jest.Mock;
const updateServicesMock = updateServices as jest.Mock;
const savePatchChangesMock = savePatchChanges as jest.Mock;

describe("campaign air conditioned controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("updateAirConditionedForPlace", () => {
    it.each([true, false, null])(
      "updates the place air conditioned modality with %p",
      async (airConditioned) => {
        const oldPlace = {
          lieu_id: 123,
          status: PlaceStatus.ONLINE,
        } as ModelWithId<ApiPlace>;
        const placeAfterModalityUpdate = {
          ...oldPlace,
          modalities: {
            thermalComfort: {
              airConditioned,
            },
          },
        } as ModelWithId<ApiPlace>;
        const updatedPlace = {
          ...placeAfterModalityUpdate,
          services_all: [],
        } as unknown as ModelWithId<ApiPlace>;
        const userForLogs = { _id: "user-id" } as unknown as UserForLogs;
        const placeChanges = { _id: "place-change-id" };

        updatePlaceByPlaceIdMock.mockResolvedValue(placeAfterModalityUpdate);
        updateServicesMock.mockResolvedValue(updatedPlace);
        savePatchChangesMock.mockResolvedValue(placeChanges);

        await expect(
          updateAirConditionedForPlace(oldPlace, airConditioned, userForLogs)
        ).resolves.toEqual({ placeChanges, updatedPlace });

        expect(updatePlaceByPlaceIdMock).toHaveBeenCalledWith(
          oldPlace.lieu_id,
          {
            "modalities.thermalComfort.airConditioned": airConditioned,
            "stepsDone.conditions": true,
          },
          true,
          oldPlace.status
        );
        expect(updateServicesMock).toHaveBeenCalledWith(
          placeAfterModalityUpdate
        );
        expect(savePatchChangesMock).toHaveBeenCalledWith(
          PlaceChangesSection.modalities,
          oldPlace,
          updatedPlace,
          userForLogs,
          true
        );
      }
    );
  });
});
