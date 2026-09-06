import { isDeepStrictEqual } from "util";

import {
  type ApiPlace,
  PlaceChangesSection,
  RegistrationScope,
} from "@soliguide/common";

import { getGeneralInformation, getSectionData } from "./place-changes-utils";

const basePlace = {
  name: "Accueil de jour",
  description: "Description",
  entity: { mail: "contact@example.org" },
} as unknown as ApiPlace;

const SIRET = {
  siret: { value: "73282932000074", scope: RegistrationScope.ORGANIZATION },
};

describe("registrations in the place changes history", () => {
  it("should omit registrations when the document has no field at all (no migration)", () => {
    expect(getGeneralInformation(basePlace)).not.toHaveProperty(
      "registrations"
    );
  });

  it("should omit registrations when the map is empty", () => {
    expect(
      getGeneralInformation({ ...basePlace, registrations: {} })
    ).not.toHaveProperty("registrations");
  });

  it("should not detect a change between an old document and the same one saved with an empty map", () => {
    const { oldSectionData, newSectionData } = getSectionData(
      PlaceChangesSection.generalinfo,
      basePlace,
      { ...basePlace, registrations: {} }
    );
    expect(isDeepStrictEqual(oldSectionData, newSectionData)).toBe(true);
  });

  it("should tolerate a Mongoose Map on a non-lean document", () => {
    const withMap = {
      ...basePlace,
      registrations: new Map(),
    } as unknown as ApiPlace;
    const { oldSectionData, newSectionData } = getSectionData(
      PlaceChangesSection.generalinfo,
      basePlace,
      withMap
    );
    expect(isDeepStrictEqual(oldSectionData, newSectionData)).toBe(true);
  });

  it("should detect an added identifier", () => {
    const { oldSectionData, newSectionData } = getSectionData(
      PlaceChangesSection.generalinfo,
      basePlace,
      { ...basePlace, registrations: SIRET }
    );
    expect(isDeepStrictEqual(oldSectionData, newSectionData)).toBe(false);
    expect(newSectionData).toMatchObject({ registrations: SIRET });
  });

  it("should detect a removed identifier", () => {
    const { oldSectionData, newSectionData } = getSectionData(
      PlaceChangesSection.generalinfo,
      { ...basePlace, registrations: SIRET },
      { ...basePlace, registrations: {} }
    );
    expect(isDeepStrictEqual(oldSectionData, newSectionData)).toBe(false);
  });
});
