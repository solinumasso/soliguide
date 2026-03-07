import * as UserRightsController from "./user-rights.controller";
import * as UserRightsService from "../services/userRights.service";

import {
  USER_ADMIN_SOLIGUIDE,
  USER_ADMIN_TERRITORY,
  ONLINE_PLACE,
  USER_PRO_ROLES_POPULATED,
} from "../../../mocks";

import { USER_ROLES_FOR_EDITION } from "../constants";
import { UserRight } from "../../_models";
import { UserRole } from "@soliguide/common";

let userAuth: any;
let placeToCheck: any;
let placeToCheckFail: any;

describe("UserRightsController", () => {
  beforeEach(() => {
    placeToCheck = structuredClone(ONLINE_PLACE);
    placeToCheckFail = structuredClone(ONLINE_PLACE);

    jest
      .spyOn(UserRightsService, "canAddPlace")
      .mockImplementation((userObjectId: any) => {
        const userRights = userAuth.userRights
          ?.map((value: UserRight) =>
            value.role === "OWNER" &&
            value.status === "VERIFIED" &&
            userAuth._id.toString() === userObjectId.toString()
              ? value
              : null
          )
          .filter((value: UserRight) => value);
        return Promise.resolve(userRights.length > 0);
      });

    jest
      .spyOn(UserRightsService, "canEditPlace")
      .mockImplementation((userObjectId, lieu_id) => {
        const userRights = userAuth.userRights
          ?.map((value: UserRight) =>
            USER_ROLES_FOR_EDITION.includes(value.role) &&
            value.status === "VERIFIED" &&
            value.place_id === lieu_id &&
            userAuth._id.toString() === userObjectId.toString()
              ? value
              : null
          )
          .filter((value: UserRight) => value);
        return Promise.resolve(userRights.length > 0);
      });

    jest
      .spyOn(UserRightsService, "canDeletePlace")
      .mockImplementation((userObjectId, lieu_id) => {
        const userRights = userAuth.userRights
          ?.map((value: UserRight) =>
            value.role === "OWNER" &&
            value.status === "VERIFIED" &&
            value.place_id === lieu_id &&
            userAuth._id.toString() === userObjectId.toString()
              ? value
              : null
          )
          .filter((value: UserRight) => value);
        return Promise.resolve(userRights.length > 0);
      });
  });

  describe("Authorization on places as a Soliguide admin", () => {
    beforeAll(() => {
      userAuth = { ...USER_ADMIN_SOLIGUIDE };
    });

    it("must always be authorized", async () => {
      expect(await UserRightsController.canAddPlace(userAuth)).toBe(true);
      expect(
        await UserRightsController.canDeletePlace(userAuth, placeToCheck)
      ).toBe(true);
      expect(
        await UserRightsController.canEditPlace(userAuth, placeToCheck)
      ).toBe(true);
    });
  });

  describe("Authorization on places as an admin territories", () => {
    beforeAll(() => {
      userAuth = { ...USER_ADMIN_TERRITORY };
    });

    beforeEach(() => {
      userAuth.areas.fr.departments = ["75"];
      placeToCheck.position.departmentCode = "75";
    });

    it("must authorize to add place", async () => {
      expect(await UserRightsController.canAddPlace(userAuth)).toBe(true);
    });

    it("must authorize if the place is in the territory", async () => {
      expect(
        await UserRightsController.canDeletePlace(userAuth, placeToCheck)
      ).toBe(true);
      expect(
        await UserRightsController.canEditPlace(userAuth, placeToCheck)
      ).toBe(true);
    });

    it("must deny if the place is outside the territory", async () => {
      userAuth.areas.fr.departments = ["93"];
      expect(
        await UserRightsController.canDeletePlace(userAuth, placeToCheckFail)
      ).toBe(false);

      expect(
        await UserRightsController.canEditPlace(userAuth, placeToCheckFail)
      ).toBe(false);
    });
  });

  describe("Authorization on places as a pro user", () => {
    describe("if the user is an owner", () => {
      beforeAll(() => {
        userAuth = { ...USER_PRO_ROLES_POPULATED };
        userAuth.userRights = userAuth.userRights.filter(
          (value: UserRight) => value.role === "OWNER"
        );
      });

      beforeEach(() => {
        placeToCheck.lieu_id = userAuth.userRights[0].place_id;
        placeToCheckFail.lieu_id = userAuth.userRights[0].place_id + 1;
      });

      it("must authorize to add a place", async () => {
        expect(await UserRightsController.canAddPlace(userAuth)).toBe(true);
      });

      it("must authorize if the user has rights on the place", async () => {
        expect(
          await UserRightsController.canDeletePlace(userAuth, placeToCheck)
        ).toBe(false);
        expect(
          await UserRightsController.canEditPlace(userAuth, placeToCheck)
        ).toBe(true);
      });

      it("must deny if the user has no rights on the place", async () => {
        expect(
          await UserRightsController.canDeletePlace(userAuth, placeToCheckFail)
        ).toBe(false);

        expect(
          await UserRightsController.canEditPlace(userAuth, placeToCheckFail)
        ).toBe(false);
      });
    });

    describe("If the pro user is an editor", () => {
      beforeAll(() => {
        userAuth = { ...USER_PRO_ROLES_POPULATED };
        userAuth.userRights[0].role = UserRole.EDITOR;
        userAuth.userRights = userAuth.userRights.filter(
          (value: UserRight) => value.role === "EDITOR"
        );
      });

      beforeEach(() => {
        placeToCheck.lieu_id = userAuth.userRights[0].place_id;
        placeToCheckFail.lieu_id = userAuth.userRights[0].place_id + 1;
      });

      it("must deny creation and deletion of a place with the same rights", async () => {
        expect(await UserRightsController.canAddPlace(userAuth)).toBe(false);
        expect(
          await UserRightsController.canDeletePlace(userAuth, placeToCheck)
        ).toBe(false);
      });

      it("must authorize retrieval and edition if the user as rights on the place", async () => {
        expect(
          await UserRightsController.canEditPlace(userAuth, placeToCheck)
        ).toBe(true);
      });

      it("must deny edition and retrieval if the user has no right on the place", async () => {
        expect(
          await UserRightsController.canEditPlace(userAuth, placeToCheckFail)
        ).toBe(false);
      });
    });
  });
});
