import "../../../place/models/photo.model";
import "../../../place/models/document.model";
import "../../../translations/models/translatedPlace.model";
import "../../../translations/models/translatedField.model";
import "../../../user/models/invitation.model";

import { CountryCodes, SortingOrder } from "@soliguide/common";

import mongoose from "mongoose";

import {
  USER_ADMIN_TERRITORY,
  USER_PRO,
  ORGANIZATION,
} from "../../../../mocks";
import { OrganizationPopulate, UserPopulateType } from "../../../_models";
import { UserRightModel } from "../../../user/models/userRight.model";
import { getOrganizationByParams } from "../../services";
import { createUser } from "../../../user/services";
import {
  createOrganization,
  patchOrganization,
  removeOrganization,
  searchOrga,
} from "../organization.controller";
import { deleteUser } from "../../../user/controllers/user-admin.controller";

let orga: OrganizationPopulate;
let orgaId: any;
let user: any;

describe("Tests of the organizations' controller", () => {
  beforeAll(async () => {
    // Create one user
    const fakeUser = {
      ...USER_PRO,
      _id: new mongoose.Types.ObjectId(),
      userRights: [],
      createdAt: null,
      updatedAt: null,
      organizations: [],
      mail: "xx@xx.fr",
    };
    user = (await createUser(fakeUser)) as UserPopulateType;
  });

  it("should add a new organization", async () => {
    const newOrga = await createOrganization({
      ...ORGANIZATION,
      country: CountryCodes.FR,
    });

    orga = (await getOrganizationByParams({
      _id: newOrga._id,
    })) as OrganizationPopulate;

    orgaId = orga._id.toString();

    expect(orgaId).not.toBeNull();
  });

  it("should search organizations", async () => {
    const query = {
      invitations: "WITHOUT_INVITATIONS",
      name: ORGANIZATION.name,
      options: {
        limit: 5,
        page: 1,
        sortBy: "users",
        sortValue: SortingOrder.DESCENDING,
      },
      users: "WITH_USERS",
    };
    const user = USER_ADMIN_TERRITORY;
    const results = await searchOrga(query, user);
    expect(results.nbResults).not.toBe(0);
  });

  it("should update one organization", async () => {
    orga = await patchOrganization(orga, {
      name: "Un nom temporaire",
      phone: {
        label: null,
        phoneNumber: "0606060606",
        countryCode: CountryCodes.FR,
        isSpecialPhoneNumber: false,
      },
    });

    expect(orga.name).toBe("Un nom temporaire");
    expect(orga.phone).toEqual({
      label: null,
      phoneNumber: "0606060606",
      countryCode: CountryCodes.FR,
      isSpecialPhoneNumber: false,
    });
  });

  it("should delete the created organization", async () => {
    await removeOrganization(orga);

    const userRights = await UserRightModel.find({
      organization: orga._id,
    });

    expect(userRights.length).toEqual(0);
  });

  afterAll(async () => {
    await deleteUser(user);

    mongoose.connection.close();
  });
});
