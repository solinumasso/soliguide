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

import { UserRightModel } from "../models/userRight.model";

import type { ModelWithId, OrganizationPopulate } from "../../_models";
import {
  UserRightStatus,
  UserRightsForOrganizations,
  UserRole,
} from "@soliguide/common";

import { updateOrga } from "../../organization/services";

import {
  USER_ROLES_FOR_EDITION,
  USERS_FIELDS_FOR_POPULATE,
} from "../constants";
import {
  UserRight,
  UserRightUserPopulate,
  UserRightOrganizationPopulate,
} from "../interfaces";

export const saveUserRights = async (
  userRights: UserRight[],
  session?: ClientSession,
  updateCounter = true
): Promise<mongoose.Types.ObjectId[]> => {
  const newRights = await UserRightModel.insertMany(userRights, { session });
  const newRightsIds = newRights.map((right) => right._id);

  // Update user rights counter
  if (updateCounter && userRights.length) {
    await updateOrganizationCounters(userRights[0].organization_id, session);
  }

  return newRightsIds;
};

/**
 * @summary Update the stand by rights, from the invitation
 */
export const validateUserRights = async (
  userObjectId: mongoose.Types.ObjectId,
  organizationObjectId: mongoose.Types.ObjectId
): Promise<ModelWithId<UserRight>[]> => {
  await UserRightModel.updateMany(
    {
      organization: organizationObjectId,
      status: UserRightStatus.PENDING,
      user: userObjectId,
    },
    {
      $set: {
        status: UserRightStatus.VERIFIED,
      },
    }
  ).exec();

  return UserRightModel.find({
    organization: organizationObjectId,
    user: userObjectId,
  });
};

export const deleteUserRights = async (
  params: mongoose.FilterQuery<UserRight>,
  session?: ClientSession
): Promise<Array<{ _id: mongoose.Types.ObjectId }>> => {
  const userRightsIds = await UserRightModel.find(params, { _id: 1 })
    .session(session ?? null)
    .lean()
    .exec();

  await UserRightModel.deleteMany(params, { session });
  return userRightsIds;
};

export const deleteUserRightsWithParams = async (
  params: mongoose.FilterQuery<UserRight>
): Promise<void> => {
  // ObjectId conversion
  for (const objectId of ["user", "place", "_id", "organization"]) {
    if (typeof params[objectId] !== "undefined") {
      params[objectId] = new mongoose.Types.ObjectId(params[objectId]);
    }
  }

  const userRights = await UserRightModel.find<ModelWithId<UserRight>>(params);

  if (userRights?.length) {
    await UserRightModel.deleteMany(params);

    const organizationsToUpdate = new Set<number>();
    // Removal in the invitations, users, organizations and places
    for (const userRight of userRights) {
      organizationsToUpdate.add(userRight.organization_id);
    }

    for (const organizationId of organizationsToUpdate) {
      await updateOrganizationCounters(organizationId);
    }
  }
};

export const canAddPlace = async (
  userObjectId: string | mongoose.Types.ObjectId
): Promise<boolean> => {
  const userRights = await UserRightModel.countDocuments({
    role: UserRole.OWNER,
    status: UserRightStatus.VERIFIED,
    user: new mongoose.Types.ObjectId(userObjectId),
  }).exec();
  return userRights > 0;
};

export const canEditPlace = async (
  userObjectId: string | mongoose.Types.ObjectId,
  place_id: number
): Promise<boolean> => {
  const userRights = await UserRightModel.countDocuments({
    place_id,
    role: { $in: USER_ROLES_FOR_EDITION },
    status: UserRightStatus.VERIFIED,
    user: new mongoose.Types.ObjectId(userObjectId),
  }).exec();
  return userRights > 0;
};

export const canDeletePlace = async (
  userObjectId: string | mongoose.Types.ObjectId,
  place_id: number
): Promise<boolean> => {
  const userRights = await UserRightModel.countDocuments({
    place_id,
    role: UserRole.OWNER,
    status: UserRightStatus.VERIFIED,
    user: new mongoose.Types.ObjectId(userObjectId),
  }).exec();
  return userRights > 0;
};

export const countUserRights = (
  params: mongoose.FilterQuery<UserRight>
): Promise<number> => {
  return UserRightModel.countDocuments(params).exec();
};

export const getUserRightsById = (
  params: mongoose.FilterQuery<UserRight>
): Promise<UserRightUserPopulate | null> => {
  return UserRightModel.findOne<UserRightUserPopulate>(params)
    .populate([{ path: "user", select: USERS_FIELDS_FOR_POPULATE }])
    .exec();
};

export const getContactsFromUserRights = (
  placeObjectId: mongoose.Types.ObjectId,
  displayContactPro?: boolean
): Promise<Array<UserRightUserPopulate>> => {
  const params: {
    place: mongoose.Types.ObjectId;
    status: UserRightStatus;
    displayContactPro?: boolean;
  } = {
    place: placeObjectId,
    status: UserRightStatus.VERIFIED,
  };

  if (displayContactPro) {
    params.displayContactPro = true;
  }

  return UserRightModel.find(params)
    .sort({ organization_id: 1 })
    .populate({ path: "user", select: USERS_FIELDS_FOR_POPULATE })
    .lean<UserRightUserPopulate[]>()
    .exec();
};
/**
 * @summary   List of user rights linked to an organization
 */
export const getUserRightsWithParams = (
  params: mongoose.FilterQuery<UserRight>,
  sort?: string | Record<string, mongoose.SortOrder>
): Promise<Array<UserRightOrganizationPopulate>> => {
  if (!sort) {
    sort = { user: 1 };
  }

  for (const objectId of ["user", "place", "_id", "organization"]) {
    if (
      typeof params[objectId] !== "undefined" &&
      typeof params[objectId] !== "object"
    ) {
      params[objectId] = new mongoose.Types.ObjectId(params[objectId]);
    }
  }

  return UserRightModel.find(params)
    .sort(sort)
    .populate({ path: "organization", select: "name" })
    .lean<UserRightOrganizationPopulate[]>()
    .exec();
};

export const getOrganizationUserRights = (
  organization: OrganizationPopulate,
  session?: ClientSession
): Promise<Pick<UserRight, "user_id" | "role" | "status" | "user">[]> => {
  return UserRightModel.aggregate([
    { $match: { organization_id: organization.organization_id } },
    {
      $group: {
        _id: "$user_id",
        role: { $first: "$role" },
        status: { $first: "$status" },
        user: { $first: "$user" },
        user_id: { $first: "$user_id" },
      },
    },
    { $project: { _id: 0, user_id: 1, role: 1, status: 1, user: 1 } },
  ])
    .session(session ?? null)
    .exec();
};

/**
 * @summary   Update a selected user right (for the professional directory)
 */
export const updateUserRightsWithParams = async (
  params: mongoose.FilterQuery<UserRight>,
  data: Partial<UserRight>
): Promise<void> => {
  for (const objectId of ["user", "place", "_id", "organization"]) {
    if (
      typeof params[objectId] !== "undefined" &&
      typeof params[objectId] !== "object"
    ) {
      params[objectId] = new mongoose.Types.ObjectId(params[objectId]);
    }
  }

  await UserRightModel.updateMany(params, data).exec();
};

/**
 * @summary   Compute the amount of account and invitations by status
 */
export const countAccountsByRole = async (
  organization_id: number | mongoose.Types.ObjectId,
  session?: ClientSession
): Promise<{
  invitations: Record<UserRole | "TOTAL", number>;
  users: Record<UserRole | "TOTAL", number>;
}> => {
  const result: {
    invitations: Record<UserRole | "TOTAL", number>;
    users: Record<UserRole | "TOTAL", number>;
  } = {
    invitations: {
      EDITOR: 0,
      OWNER: 0,
      READER: 0,
      TOTAL: 0,
    },
    users: {
      EDITOR: 0,
      OWNER: 0,
      READER: 0,
      TOTAL: 0,
    },
  };

  const invitations = await UserRightModel.aggregate<{
    count: number;
    role: UserRole;
  }>([
    { $match: { organization_id, status: UserRightStatus.PENDING } },
    { $group: { _id: { role: "$role" }, count: { $addToSet: "$user" } } },
    { $sort: { _id: 1 } },
    { $project: { _id: false, count: { $size: "$count" }, role: "$_id.role" } },
    { $sort: { role: 1 } },
  ]).session(session ?? null);

  for (const invitation of invitations) {
    result.invitations[invitation.role] = invitation.count;
    result.invitations.TOTAL += invitation.count;
  }

  const users = await UserRightModel.aggregate<{
    count: number;
    role: UserRole;
  }>([
    { $match: { organization_id, status: UserRightStatus.VERIFIED } },
    { $group: { _id: { role: "$role" }, count: { $addToSet: "$user" } } },
    { $sort: { _id: 1 } },
    { $project: { _id: false, count: { $size: "$count" }, role: "$_id.role" } },
    { $sort: { role: 1 } },
  ]).session(session ?? null);

  for (const user of users) {
    result.users[user.role] = user.count;
    result.users.TOTAL += user.count;
  }

  return result;
};

export const updateOrganizationCounters = async (
  organization_id: number,
  session?: ClientSession
) => {
  const counters = await countAccountsByRole(organization_id, session);
  return updateOrga({ organization_id }, { counters }, session);
};

export const isUserInOrganization = async (
  userObjectId: mongoose.Types.ObjectId,
  organizationObjectId: mongoose.Types.ObjectId
): Promise<boolean> => {
  const userRightInOrganization = await UserRightModel.findOne({
    organization: organizationObjectId,
    user: userObjectId,
  });
  return !!userRightInOrganization;
};

export const getUserRightsForOrganization = async (
  organization: OrganizationPopulate
): Promise<UserRightsForOrganizations[]> => {
  return await UserRightModel.aggregate([
    {
      $match: {
        organization_id: organization.organization_id,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $lookup: {
        from: "lieux",
        localField: "place",
        foreignField: "_id",
        as: "places",
      },
    },
    {
      $group: {
        _id: "$user._id",
        user_id: { $first: "$user.user_id" },
        userObjectId: { $first: "$user._id" },
        role: { $first: "$role" },
        lastname: { $first: "$user.lastname" },
        mail: { $first: "$user.mail" },
        name: { $first: "$user.name" },
        status: { $first: "$user.status" },
        verified: { $first: "$user.verified" },
        places: { $push: { $arrayElemAt: ["$places.lieu_id", 0] } },
      },
    },
    {
      $sort: { role: -1 },
    },
    {
      $project: {
        _id: 0,
        user_id: 1,
        userObjectId: 1,
        role: 1,
        lastname: 1,
        mail: 1,
        name: 1,
        status: 1,
        verified: 1,
        places: 1,
      },
    },
  ]).exec();
};
