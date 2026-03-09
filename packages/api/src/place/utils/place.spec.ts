import {
  getHoursFromParcours,
  removeFieldFromPlaceForDuplication,
} from "./place";

import { ONLINE_PLACE } from "../../../mocks/places/ONLINE_PLACE.mock";
import { ONLINE_ITINERARY } from "../../../mocks/places/ONLINE_ITINERARY.mock";
import { PARCOURS } from "../../../mocks/PARCOURS.mock";

describe("Tests the removal of the fields to be removed for the duplication of places", () => {
  it("Should delete all useless properties for a duplicate place", () => {
    const placeToDuplicate = removeFieldFromPlaceForDuplication(
      structuredClone(ONLINE_PLACE)
    );
    expect(placeToDuplicate._id).toBeUndefined();
    expect(placeToDuplicate.services_all[0].serviceObjectId).not.toStrictEqual(
      ONLINE_PLACE.services_all[0].serviceObjectId
    );
  });
});

describe("Tests the function that builds the Newhours field from the journey points of a marald", () => {
  it("Must build the Newhours field of a route from a route", () => {
    expect({ ...getHoursFromParcours(PARCOURS) }).toStrictEqual(
      ONLINE_ITINERARY.newhours
    );
  });
});
