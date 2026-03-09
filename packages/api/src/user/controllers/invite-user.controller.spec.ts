import "../../place/models/photo.model";
import "../../place/models/document.model";

import "../../translations/models/translatedField.model";
import "../../translations/models/translatedPlace.model";

import mongoose from "mongoose";

import { CountryCodes, UserRole, UserStatus } from "@soliguide/common";

import * as InviteUserController from "./invite-user.controller";
import * as UserAdminController from "./user-admin.controller";
import * as OrganizationController from "../../organization/controllers/organization.controller";

import { InvitationModel } from "../models/invitation.model";

import { UserToInvite, InvitationPopulate } from "../../_models";

import { ORGANIZATION } from "../../../mocks/ORGANIZATION.mock";
import { ONLINE_PLACE } from "../../../mocks/places/ONLINE_PLACE.mock";
import { ABSTRACT_USER } from "../../../mocks/users/ABSTRACT_USER.mock";
import { getInvitationByUserId, getUserByParams } from "../services";
import {
  addNewPlace,
  getNextPlaceId,
} from "../../place/services/admin-place.service";
import { deletePlace } from "../../place/controllers/admin-place.controller";

describe("Test the 'InviteUser' controller", () => {
  let organization: any;
  let place: any;
  let invitation: InvitationPopulate;
  let user: any;

  beforeAll(async () => {
    delete ONLINE_PLACE["_id"];
    delete ONLINE_PLACE["lieu_id"];
    delete ONLINE_PLACE["createdAt"];
    delete ONLINE_PLACE["updatedByUserAt"];
    delete ONLINE_PLACE["updatedAt"];

    ONLINE_PLACE.lieu_id = await getNextPlaceId();

    place = await addNewPlace(ONLINE_PLACE);

    ORGANIZATION.places = [`${place._id}`];

    organization = await OrganizationController.createOrganization({
      ...ORGANIZATION,
      country: CountryCodes.FR,
    });
  });

  it("must invite a user as a Pro", async () => {
    const userData: UserToInvite = {
      ...ABSTRACT_USER,
      lastname: "Nom de famille",
      mail: "adresse-email@domain.extension",
      name: "Prénom",
      organization: organization._id.toString(),
      role: UserRole.OWNER,
      places: [],
      country: CountryCodes.FR,
    };

    const userWhoInvite: any = {
      ...ABSTRACT_USER,
      _id: new mongoose.Types.ObjectId(0),
      lastname: "CI",
      name: "SOLIBOT",
      mail: "soli@bot.com",
      user_id: 0,
    };

    invitation = await InviteUserController.createUserWithInvitation(
      userData,
      userWhoInvite,
      organization
    );

    user = invitation.user;
    expect(invitation._id.toString()).not.toBeNull();
    expect(user).not.toBeUndefined();
    expect(user).not.toBeNull();
    expect(user._id!.toString()).not.toBeNull();
  });

  it("must accept the first invitation", async () => {
    const invitationUser = await InviteUserController.acceptFirstInvitation(
      invitation,
      "$7a$03$e2/ftNojcbjYSwHeAwpBVKm.KVkhFHsk1qqX31kzy7SZ3GbQwpkhW"
    );
    const updatedInvitation = await InvitationModel.findById(
      invitation._id
    ).exec();
    expect(updatedInvitation).not.toBeNull();
    expect(updatedInvitation!.pending).toBeFalsy();
    expect(invitationUser.status).toEqual(UserStatus.PRO);
    expect(invitationUser._id).not.toBeUndefined();
    expect(invitationUser._id!.toString()).toEqual(user._id!.toString());
    user = invitationUser;
  });

  it("must delete an invitation", async () => {
    await InviteUserController.deleteInvitation(invitation);
    const updatedUser = await getUserByParams({ _id: invitation.user._id });
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.invitations.length).toEqual(0);
  });

  it("must delete the invitation's user", async () => {
    await UserAdminController.deleteUser(user);
    const updatedUser = await getUserByParams({ _id: user._id });
    const invitations = await getInvitationByUserId(user._id);
    expect(invitations.length).toEqual(0);
    expect(updatedUser).toBeNull();
  });

  afterAll(async () => {
    if (user) {
      await UserAdminController.deleteUser(user);
    }

    if (organization) {
      await OrganizationController.removeOrganization(organization);
    }

    if (place) {
      await deletePlace(place);
    }

    mongoose.connection.close();
  });
});
