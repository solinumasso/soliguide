import { CountryCodes, GeoTypes, UserStatus } from "@soliguide/common";
import { describe, expect, it } from "vitest";

import { WidgetCountryLimitPolicy } from "./widget-country-limit.policy";

describe("WidgetCountryLimitPolicy", () => {
  const policy = new WidgetCountryLimitPolicy();

  it("forces France for POSITION locations for WIDGET_USER", () => {
    const result = policy.apply(
      {
        locations: [
          {
            geoType: GeoTypes.POSITION,
            coordinates: [2.35, 48.85],
            country: CountryCodes.ES,
          },
        ],
      },
      { userStatus: UserStatus.WIDGET_USER }
    );

    expect(result.locations).toEqual([
      expect.objectContaining({
        geoType: GeoTypes.POSITION,
        country: CountryCodes.FR,
      }),
    ]);
  });

  it("forces France for COUNTRY locations for WIDGET_USER", () => {
    const result = policy.apply(
      {
        locations: [
          {
            geoType: GeoTypes.COUNTRY,
            country: CountryCodes.ES,
          },
        ],
      },
      { userStatus: UserStatus.WIDGET_USER }
    );

    expect(result.locations).toEqual([
      expect.objectContaining({
        geoType: GeoTypes.COUNTRY,
        country: CountryCodes.FR,
      }),
    ]);
  });

  it("does not alter locations for non-widget users", () => {
    const result = policy.apply(
      {
        locations: [
          {
            geoType: GeoTypes.COUNTRY,
            country: CountryCodes.ES,
          },
        ],
      },
      { userStatus: UserStatus.SIMPLE_USER }
    );

    expect(result.locations).toEqual([
      expect.objectContaining({
        country: CountryCodes.ES,
      }),
    ]);
  });
});
