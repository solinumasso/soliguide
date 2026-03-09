import { aggregateUserRightsForAuth } from "../aggregateUserRightsForAuth";

import { UserRole, UserRightStatus } from "@soliguide/common";
import { USER_PRO } from "../../../../mocks";
import { UserPopulateType } from "../../../_models";

describe("aggregateUserRightsForAuth", () => {
  const USER_FOR_TEST: UserPopulateType = {
    ...USER_PRO,
    userRights: [
      {
        _id: "5fb648823cb90874d9ab1bef",
        organization_id: 2316,
        place_id: 1,
        territories: ["75"],
        role: UserRole.OWNER,
        status: UserRightStatus.VERIFIED,
      },
      {
        _id: "xxxx",
        organization_id: 230,
        place_id: 1,
        territories: ["75"],
        role: UserRole.OWNER,
        status: UserRightStatus.VERIFIED,
      },
    ],
  };
  describe("By user", () => {
    it("Should return the rights for the two organizations", () => {
      expect(aggregateUserRightsForAuth(USER_FOR_TEST)).toStrictEqual({
        places: [1],
        role: UserRole.OWNER,
      });
    });
  });
});
