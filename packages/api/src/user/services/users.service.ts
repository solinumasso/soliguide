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
import {
  ApiOrganization,
  CAMPAIGN_DEFAULT_NAME,
  AnyDepartmentCode,
  UserSearchContext,
  UserStatus,
} from "@soliguide/common";

import mongoose, { ClientSession } from "mongoose";

import { DEFAULT_USER_POPULATE } from "../constants";
import { FIELDS_TO_SELECT_FOR_SEARCH } from "../constants/FIELDS_TO_SELECT_FOR_SEARCH.const";

import { UserModel } from "../models/user.model";
import type {
  SignupUser,
  User,
  UserPopulateType,
  ModelWithId,
  OrganizationPopulate,
} from "../../_models";
import { DEFAULT_SEARCH_OPTIONS } from "../../_utils/constants";
import { hashPassword } from "../../_utils";
import { getMongoId } from "../../_utils/functions/mongo";
import { getUserRightsWithParams } from "./userRights.service";
import { PARTNERS_EMAIL_DOMAIN } from "../../partners";
import { mergeOperationalAreas } from "../utils";

export const getUserByParams = (
  params: mongoose.FilterQuery<User>,
  session?: ClientSession
): Promise<UserPopulateType | null> => {
  if (params._id) {
    params._id = new mongoose.Types.ObjectId(params._id);
  }

  return UserModel.findOne<UserPopulateType>(params)
    .populate(DEFAULT_USER_POPULATE)
    .session(session ?? null)
    .lean<UserPopulateType>()
    .exec();
};

export const getUserByIdWithUserRights = async (
  userObjectId: string | mongoose.Types.ObjectId
): Promise<UserPopulateType | null> => {
  const user = await getUserByParams({
    _id: userObjectId,
  });
  if (user) {
    user.userRights = await getUserRightsWithParams({ user: user._id });
  }
  return user;
};

export const createUser = async (
  user: SignupUser & Pick<User, "status" | "verified" | "verifiedAt">,
  session?: ClientSession
): Promise<UserPopulateType | null> => {
  // Get the new available ID
  const lastUser = await UserModel.findOne()
    .select("user_id")
    .sort({ user_id: -1 })
    .exec();

  const user_id = lastUser ? lastUser.user_id + 1 : 0;

  const userToCreate = {
    ...user,
    password: await hashPassword(user.password),
    user_id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createdUser = await new UserModel(userToCreate).save({ session });
  const populatedUser = (await createdUser.populate(
    DEFAULT_USER_POPULATE
  )) as UserPopulateType;
  populatedUser.userRights = await getUserRightsWithParams({
    user: populatedUser._id,
  });

  return populatedUser;
};

export const searchUsers = (
  params: mongoose.FilterQuery<User>,
  options: mongoose.QueryOptions<User> = DEFAULT_SEARCH_OPTIONS,
  context = UserSearchContext.MANAGE_USERS
) => {
  const fieldsToSelect = FIELDS_TO_SELECT_FOR_SEARCH[context];

  if (params._id) {
    params._id = new mongoose.Types.ObjectId(params._id);
  }

  let query = UserModel.find(params);

  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.skip) {
    query = query.skip(options.skip);
  }
  return query
    .sort(options.sort)
    .select(fieldsToSelect)
    .populate([
      "organizations",
      "invitations",
      {
        path: "invitations",
        populate: { path: "organization", select: "_id organization_id" },
      },
    ])
    .collation({ locale: "fr", strength: 1 })
    .lean<UserPopulateType[]>()
    .exec();
};

export const countUsers = (query: mongoose.FilterQuery<User>) => {
  return UserModel.countDocuments(query).exec();
};

export const updateUser = (
  params: mongoose.FilterQuery<User>,
  data: Partial<User>,
  session?: ClientSession,
  timestamps = true
): Promise<UserPopulateType | null> => {
  if (params._id) {
    params._id = new mongoose.Types.ObjectId(params._id);
  }

  return UserModel.findOneAndUpdate<UserPopulateType>(
    params,
    { $set: data },
    { new: true, timestamps, session }
  )
    .populate(DEFAULT_USER_POPULATE)
    .exec();
};

export const updateUsers = (
  filter: mongoose.FilterQuery<User>,
  data: mongoose.UpdateQuery<User>,
  timestamps = true
) => {
  return UserModel.updateMany(filter, data, { timestamps });
};

export const updateUserAfterInvitation = (
  organization: OrganizationPopulate,
  userObjectId: string | mongoose.Types.ObjectId,
  invitationObjectId: string | mongoose.Types.ObjectId
): Promise<UserPopulateType | null> => {
  const _id = new mongoose.Types.ObjectId(userObjectId);

  const verified = true;
  const verifiedAt = new Date();

  return UserModel.findOneAndUpdate<UserPopulateType>(
    { _id },
    {
      $addToSet: {
        organizations: new mongoose.Types.ObjectId(organization._id),
      },
      $pull: {
        invitations: new mongoose.Types.ObjectId(invitationObjectId),
      },
      $set: { verified, verifiedAt },
    },
    { new: true }
  )
    .populate(DEFAULT_USER_POPULATE)
    .lean<UserPopulateType>()
    .exec();
};

export const pushElementInUser = async (
  users: mongoose.Types.ObjectId[],
  element: string,
  elementIds: mongoose.Types.ObjectId[],
  session?: ClientSession
): Promise<void> => {
  await UserModel.findOneAndUpdate<UserPopulateType>(
    { _id: { $in: users } },
    {
      $addToSet: {
        [element]: { $each: elementIds },
      },
    },
    { session }
  ).exec();
};

export const getUserForLogin = (
  mail: string
): Promise<UserPopulateType | null> => {
  return UserModel.findOne<UserPopulateType>({ mail, verified: true })
    .populate(DEFAULT_USER_POPULATE)
    .select("+password")
    .lean<UserPopulateType>()
    .exec();
};

export const updateUserLastLogin = (
  userId: string | mongoose.Types.ObjectId
): Promise<UserPopulateType | null> => {
  return UserModel.findByIdAndUpdate<UserPopulateType>(
    userId,
    { $set: { lastLogin: new Date() } },
    { new: true }
  )
    .populate(DEFAULT_USER_POPULATE)
    .exec();
};

export const deleteUserWithParams = (
  params: mongoose.FilterQuery<User>,
  session?: ClientSession
) => {
  if (params._id) {
    params._id = new mongoose.Types.ObjectId(params._id);
  }
  return UserModel.findOneAndDelete(params, { session }).lean().exec();
};

export const updateUsersTerritories = async (
  userObjectId: string | mongoose.Types.ObjectId
): Promise<UserPopulateType | null> => {
  const _id = getMongoId(userObjectId);
  const user = await UserModel.findOne<UserPopulateType | null>({ _id })
    .populate("organizations")
    .exec();

  if (!user) {
    throw new Error(`Cannot find user with id ${userObjectId}`);
  }

  let territoriesFromOrga: AnyDepartmentCode[] = [];

  if (Array.isArray(user.organizations) && user.organizations?.length) {
    user.organizations.forEach((organization: ModelWithId<ApiOrganization>) => {
      // @deprecated
      territoriesFromOrga = territoriesFromOrga.concat(
        organization.territories
      );

      user.areas = mergeOperationalAreas(organization?.areas, user?.areas);
    });
  }

  const territories =
    user.organizations?.length && territoriesFromOrga.length
      ? Array.from(new Set(territoriesFromOrga))
      : [];

  const userStatus = user.status;

  // If the user is in no organization and it's not an admin nor an API user, we change the user to SIMPLE_USER
  const status = [
    UserStatus.ADMIN_SOLIGUIDE,
    UserStatus.ADMIN_TERRITORY,
    UserStatus.API_USER,
  ].includes(userStatus)
    ? userStatus
    : UserStatus.PRO;

  return UserModel.findOneAndUpdate<UserPopulateType>(
    { _id },
    { $set: { status, territories, areas: user.areas } },
    { new: true }
  )
    .lean<UserPopulateType>()
    .exec();
};

/**
 * @returns Invited list or a user to contact during the campaign
 */
export const findUsersToEmail = (
  territories: AnyDepartmentCode[],
  emailType: string
) => {
  const isInvitation = emailType?.includes("INVITATION");
  const isRelance = emailType?.includes("RELANCE");

  return searchUsers(
    {
      $or: [
        { [`campaigns.${CAMPAIGN_DEFAULT_NAME}.${emailType}.ready`]: false },
        {
          [`campaigns.${CAMPAIGN_DEFAULT_NAME}.${emailType}.ready`]: {
            $exists: false,
          },
        },
      ],
      $and: Object.values(PARTNERS_EMAIL_DOMAIN).map((domain: string) => {
        return {
          mail: {
            $not: { $regex: domain, $options: "i" },
          },
        };
      }),
      ...(isInvitation
        ? {
            "invitations.0": { $exists: true },
            // For relances, ensure users received the initial campaign
            ...(isRelance
              ? {
                  [`campaigns.${CAMPAIGN_DEFAULT_NAME}.CAMPAGNE_INVITATIONS.ready`]:
                    true,
                }
              : {}),
          }
        : {
            "organizations.0": { $exists: true },
            // For relances, ensure users received the initial campaign
            ...(isRelance
              ? {
                  [`campaigns.${CAMPAIGN_DEFAULT_NAME}.CAMPAGNE_COMPTES_PRO.ready`]:
                    true,
                }
              : {}),
          }),
      // Special filter for "TERMINER" (reminder of reminder)
      ...(emailType?.includes("TERMINER")
        ? {
            [`campaigns.${CAMPAIGN_DEFAULT_NAME}.RELANCE_CAMPAGNE_COMPTES_PRO.ready`]:
              true,
          }
        : {}),

      status: UserStatus.PRO,
      "areas.fr.departments": { $in: territories },
    },
    {
      page: 1,
      skip: 0,
      sort: { createdAt: "descending" },
    }
  );
};

export const findUsersToContactAgain = (
  territories: AnyDepartmentCode[],
  emailType: string
) => {
  const isInvitation = emailType?.includes("INVITATION");

  return UserModel.aggregate([
    {
      $match: {
        $or: [
          { [`campaigns.${CAMPAIGN_DEFAULT_NAME}.${emailType}.ready`]: false },
          {
            [`campaigns.${CAMPAIGN_DEFAULT_NAME}.${emailType}.ready`]: {
              $exists: false,
            },
          },
        ],
        $and: Object.values(PARTNERS_EMAIL_DOMAIN).map((domain: string) => {
          return {
            mail: {
              $not: { $regex: domain, $options: "i" },
            },
          };
        }),
        ...(isInvitation
          ? {
              "invitations.0": { $exists: true },
              [`campaigns.${CAMPAIGN_DEFAULT_NAME}.CAMPAGNE_INVITATIONS.ready`]:
                true,
            }
          : {
              "organizations.0": { $exists: true },
              [`campaigns.${CAMPAIGN_DEFAULT_NAME}.CAMPAGNE_COMPTES_PRO.ready`]:
                true,
            }),
        status: UserStatus.PRO,
        "areas.fr.departments": { $in: territories },
        ...(emailType?.includes("TERMINER")
          ? {
              [`campaigns.${CAMPAIGN_DEFAULT_NAME}.RELANCE_CAMPAGNE_COMPTES_PRO.ready`]:
                true,
            }
          : {}),
      },
    },
    {
      $project: {
        _id: 1,
        invitations: 1,
        lastname: 1,
        mail: 1,
        name: 1,
        organizations: 1,
        territories: 1,
        areas: 1,
        user_id: 1,
      },
    },
    // For invited people, we want info to simulate a populate of the function find
    {
      $unwind: {
        path: "$invitations",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        as: "invitations",
        foreignField: "_id",
        from: "invitations",
        localField: "invitations",
      },
    },
    // For pro users, we want the organization info to simulate a populate of the function find
    {
      $unwind: {
        path: "$organizations",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        as: "organizations",
        foreignField: "_id",
        from: "organization",
        localField: "organizations",
      },
    },
    {
      $group: {
        _id: "$_id",
        invitations: { $first: "$invitations" },
        lastname: { $first: "$lastname" },
        mail: { $first: "$mail" },
        name: { $first: "$name" },
        organizations: { $first: "$organizations" },
        territories: { $first: "$territories" },
        user_id: { $first: "$user_id" },
      },
    },
  ]).exec();
};

export const updateUsersAfterRemovedFromOrganization = (
  userObjectIds: mongoose.Types.ObjectId[],
  organizationObjectIds: mongoose.Types.ObjectId[],
  invitationObjectIds: mongoose.Types.ObjectId[],
  session?: ClientSession
) => {
  return UserModel.findOneAndUpdate<UserPopulateType | null>(
    { _id: { $in: userObjectIds } },
    {
      $pull: {
        organizations: { $in: organizationObjectIds },
        invitations: { $in: invitationObjectIds },
      },
      $set: {
        selectedOrgaIndex: 0,
      },
    },
    { new: true, session }
  );
};
