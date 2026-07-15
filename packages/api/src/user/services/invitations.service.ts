import mongoose, { ClientSession } from "mongoose";

import { USERS_FIELDS_FOR_POPULATE } from "../constants";

import { InvitationModel } from "../models/invitation.model";

import { generateUrlToken } from "../../_utils";
import type {
  Invitation,
  InvitationPopulate,
  OrganizationPopulate,
  UserPopulateType,
} from "../../_models";
import { UserRole } from "@soliguide/common";

export const createInvitation = async (
  userWhoInvite: UserPopulateType,
  organization: OrganizationPopulate,
  createdUser: UserPopulateType,
  role: UserRole,
  session?: ClientSession
): Promise<InvitationPopulate> => {
  const invitationToSave: Partial<Invitation> = {
    createdBy: userWhoInvite._id,

    organization: organization._id,
    organizationName: organization.name,

    // Id in number
    organization_id: organization.organization_id,

    pending: true,
    roleType: role,
    territories: organization.territories,

    // Invitation token = objectID for old invitations
    token: generateUrlToken(),

    // Account associated to the invitation
    user: createdUser._id,

    // ID as a number
    user_id: createdUser.user_id,
  };

  const createdInvitation = await new InvitationModel(invitationToSave).save({
    session,
  });

  // The session must be forwarded to populate: when this runs inside a
  // transaction, the referenced user may have just been created in the same
  // (not yet committed) transaction. Without the session, populate reads
  // outside the transaction and resolves "user" to null.
  return await createdInvitation.populate([
    { path: "organization", options: { session } },
    { path: "user", select: USERS_FIELDS_FOR_POPULATE, options: { session } },
  ]);
};

export const updateInvitationWithParams = async (
  params: mongoose.FilterQuery<Invitation>,
  data: Partial<Invitation>
): Promise<InvitationPopulate | null> => {
  return InvitationModel.findOneAndUpdate(params, { $set: data }, { new: true })
    .populate([
      { path: "user", select: USERS_FIELDS_FOR_POPULATE },
      "organization",
    ])
    .lean<InvitationPopulate>()
    .exec();
};

export const getInvitationByToken = async (
  invitationToken: string
): Promise<InvitationPopulate | null> => {
  return InvitationModel.findOne<InvitationPopulate>({
    pending: true,
    token: invitationToken,
  })
    .populate([
      { path: "user", select: USERS_FIELDS_FOR_POPULATE },
      "organization",
    ])
    .lean()
    .exec();
};

export const getInvitationByUserId = (
  userId: mongoose.Types.ObjectId | string
): Promise<Invitation[]> => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  return InvitationModel.find({
    user: userObjectId,
  })
    .lean<Invitation[]>()
    .exec();
};

export const deleteInvitationWithParams = async (
  params: mongoose.FilterQuery<Invitation>,
  session?: ClientSession
): Promise<void> => {
  // ObjectId conversion
  for (const objectId of ["user", "_id", "organization"]) {
    if (typeof params[objectId] !== "undefined") {
      params[objectId] = new mongoose.Types.ObjectId(params[objectId]);
    }
  }

  await InvitationModel.deleteMany(params, { session });
};
