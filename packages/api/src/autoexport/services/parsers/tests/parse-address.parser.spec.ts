import { CommonPlacePosition, CountryCodes } from "@soliguide/common";

import { parseAddress } from "../parse-address.parser";

describe("Get complete address for place ", () => {
  const POSITION_MOCK: CommonPlacePosition = new CommonPlacePosition({
    adresse: "32 rue Bouret, 75019 Paris",
    address: "32 rue Bouret, 75019 Paris",
    postalCode: "75019",
    codePostal: "75019",
    complementAdresse: null,
    department: "Paris",
    departmentCode: "75",
    location: {
      coordinates: [2.3742211, 48.8817267],
      type: "Point",
    },
    country: CountryCodes.FR,
    pays: "France",
    region: "Île-de-France",
    slugs: {
      department: "paris",
      departement: "paris",
      pays: "france",
      country: CountryCodes.FR,
      region: "ile-de-france",
      ville: "paris",
    },
    ville: "Paris",
    city: "Paris",
  });
  it("Without Additional address", () => {
    expect(parseAddress(POSITION_MOCK)).toEqual("32 rue Bouret, 75019 Paris");
  });
  it("With Additional address", () => {
    POSITION_MOCK.additionalInformation = "this is an additional informations";
    expect(parseAddress(POSITION_MOCK)).toEqual(
      "32 rue Bouret (this is an additional informations), 75019 Paris"
    );
  });
});
