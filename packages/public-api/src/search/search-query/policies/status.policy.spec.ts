import { PlaceStatus, UserStatus } from "@soliguide/common";
import { describe, expect, it } from "vitest";

import { OnlineStatusPolicy } from "./status.policy";

describe("OnlineStatusPolicy", () => {
  const policy = new OnlineStatusPolicy();

  it("enforces ONLINE status", () => {
    const result = policy.apply(
      { status: PlaceStatus.OFFLINE },
      {
        userStatus: UserStatus.SIMPLE_USER,
        placeAccess: { status: PlaceStatus.ONLINE },
      }
    );

    expect(result.status).toBe(PlaceStatus.ONLINE);
  });
});
