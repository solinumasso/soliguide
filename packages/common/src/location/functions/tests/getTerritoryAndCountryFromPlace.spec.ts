import { getTerritoryAndCountryFromPlace } from "../getTerritoryAndCountryFromPlace";
import { CountryCodes } from "../../enums";
import { ApiPlace, CommonPlacePosition, PlaceType } from "../../../place";
describe("getTerritoryAndCountryFromPlace", () => {
  const place = {
    placeType: PlaceType.PLACE,
    position: new CommonPlacePosition({
      departmentCode: "75",
      country: CountryCodes.FR,
    }),
  } as unknown as ApiPlace;

  const itinerary = {
    placeType: PlaceType.ITINERARY,
    parcours: [
      {
        position: new CommonPlacePosition({
          departmentCode: "75",
          country: CountryCodes.FR,
        }),
      },
    ],
  } as unknown as ApiPlace;

  it("should return '75' if place is in Paris", () => {
    expect(getTerritoryAndCountryFromPlace(place)).toEqual({
      territory: "75",
      country: CountryCodes.FR,
    });
  });
  it("should return '75' if itinerary is in Paris", () => {
    expect(getTerritoryAndCountryFromPlace(itinerary)).toEqual({
      territory: "75",
      country: CountryCodes.FR,
    });
  });
});
