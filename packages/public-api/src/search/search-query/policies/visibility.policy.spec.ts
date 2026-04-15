import {
  PlaceVisibility,
  UserStatus,
  UserStatusNotLogged,
} from "@soliguide/common";
import { describe, expect, it } from "vitest";

import { NonAdminUserStatus, SearchQuery } from "../search-query";
import { AllVisibilityPolicy as VisibilityPolicy } from "./visibility.policy";

describe("VisibilityPolicy", () => {
  const policy = new VisibilityPolicy();

  it.each([
    UserStatus.SIMPLE_USER,
    UserStatus.VOLUNTEER,
    UserStatus.WIDGET_USER,
    UserStatus.API_USER,
    UserStatus.SOLI_BOT,
    UserStatusNotLogged.NOT_LOGGED,
  ] satisfies NonAdminUserStatus[])(
    "enforces ALL visibility for %s",
    (status: NonAdminUserStatus) => {
      const result = policy.apply(
        { visibility: PlaceVisibility.PRO } as SearchQuery,
        { userStatus: status }
      );

      expect(result.visibility).toBe(PlaceVisibility.ALL);
    }
  );

  it("does not force visibility for PRO", () => {
    const result = policy.apply(
      { visibility: PlaceVisibility.PRO },
      { userStatus: UserStatus.PRO }
    );

    expect(result.visibility).toBe(PlaceVisibility.PRO);
  });
});
