import { CountryCodes, GeoTypes } from "@soliguide/common";
import { describe, expect, it } from "vitest";

import { DefaultCountryPolicy } from "./default-country.policy";

describe("DefaultCountryPolicy", () => {
  const policy = new DefaultCountryPolicy();

  it("sets France for POSITION locations without country", () => {
    const result = policy.apply({
      locations: [
        {
          geoType: GeoTypes.POSITION,
          coordinates: [2.35, 48.85],
        },
      ],
    });

    expect(result.locations).toEqual([
      expect.objectContaining({
        geoType: GeoTypes.POSITION,
        country: CountryCodes.FR,
      }),
    ]);
  });

  it("keeps explicit country for POSITION locations", () => {
    const result = policy.apply({
      locations: [
        {
          geoType: GeoTypes.POSITION,
          coordinates: [2.35, 48.85],
          country: CountryCodes.ES,
        },
      ],
    });

    expect(result.locations).toEqual([
      expect.objectContaining({
        country: CountryCodes.ES,
      }),
    ]);
  });
});
