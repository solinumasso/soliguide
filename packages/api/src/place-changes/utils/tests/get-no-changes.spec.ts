import { PlaceChangesSection } from "@soliguide/common";
import { getNoChanges } from "../place-changes-utils";

describe("getNoChanges", () => {
  it("should return true if noChanges is true", () => {
    expect(
      getNoChanges(
        true,
        PlaceChangesSection.hours,
        { name: "hehehe" },
        { name: "hohoho" }
      )
    ).toBe(true);
  });

  it("should return false if section is 'photos'", () => {
    expect(
      getNoChanges(
        false,
        PlaceChangesSection.photos,
        { name: "xxx" },
        { name: "yyy" }
      )
    ).toBe(false);
  });

  it("should return true if section is false, but content is equal", () => {
    const data = {
      name: "value",
      entity: {
        name: "Little poney",
        phones: [],
      },
    };
    expect(
      getNoChanges(false, PlaceChangesSection.hours as any, data, data)
    ).toBe(true);
  });

  it("should return false if content is not equal", () => {
    const oldData = {
      name: "value",
      entity: {
        name: "Little turtle",
        phones: [],
      },
    };

    const newData = {
      name: "value",
      entity: {
        name: "Little horse",
        phones: [],
      },
    };
    expect(
      getNoChanges(false, PlaceChangesSection.hours as any, newData, oldData)
    ).toBe(false);
  });
});
