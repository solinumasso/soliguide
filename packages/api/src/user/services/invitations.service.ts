/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import mongoose, { ClientSession } from "mongoose";

import { USERS_FIELDS_FOR_POPULATE } from "../constants";

import { InvitationModel } from "../models/invitation.model";

import { generateUrlToken } from "../../_utils";
import type { OrganizationPopulate } from "../../_models";
import { SoliguideCountries, UserRole } from "@soliguide/common";
import { extractTerritoriesFromAreasForCountry } from "../utils";
import {
  UserPopulateType,
  InvitationPopulate,
  Invitation,
} from "../interfaces";

export const createInvitation = async (
  userWhoInvite: UserPopulateType,
  organization: OrganizationPopulate,
  createdUser: UserPopulateType,
  role: UserRole,
  country: SoliguideCountries,
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
    territories: extractTerritoriesFromAreasForCountry(
      organization.areas,
      country
    ),

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

  return await createdInvitation.populate([
    "organization",
    { path: "user", select: USERS_FIELDS_FOR_POPULATE },
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
