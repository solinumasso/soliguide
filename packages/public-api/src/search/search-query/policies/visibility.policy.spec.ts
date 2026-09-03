import { PlaceStatus, PlaceVisibility, UserStatus } from "@soliguide/common";
import { describe, expect, it } from "vitest";

import { SearchQuery } from "../search-query";
import { VisibilityPolicy } from "./visibility.policy";

describe("VisibilityPolicy", () => {
  const policy = new VisibilityPolicy();

  it("applies the visibility from the place access query", () => {
    const result = policy.apply(
      { visibility: PlaceVisibility.PRO },
      {
        userStatus: UserStatus.PRO,
        placeAccess: {
          status: PlaceStatus.ONLINE,
          visibility: PlaceVisibility.ALL,
        },
      }
    );

    expect(result.visibility).toBe(PlaceVisibility.ALL);
  });

  it("leaves visibility unrestricted when it is absent from the place access query", () => {
    const result = policy.apply(
      { visibility: PlaceVisibility.PRO },
      {
        userStatus: UserStatus.PRO,
        placeAccess: { status: PlaceStatus.ONLINE },
      }
    );

    expect(result.visibility).toBe(PlaceVisibility.PRO);
  });
});
