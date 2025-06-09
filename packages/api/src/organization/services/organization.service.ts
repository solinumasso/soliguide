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

import { ApiOrganization } from "@soliguide/common";
import mongoose, { ClientSession, FilterQuery, UpdateQuery } from "mongoose";
import { OrganizationModel } from "../models/organization.model";

import { DEFAULT_SEARCH_OPTIONS } from "../../_utils/constants";
import {
  PLACE_FIELDS_FOR_USERS,
  USERS_FIELDS_FOR_POPULATE,
} from "../../user/constants";
import { OrganizationPopulate, ModelWithId } from "../../_models";
import { countAccountsByRole } from "../../user/services";
import { UserPopulateType, InvitationPopulate } from "../../user/interfaces";

/**
 * @summary Save an organization
 * @param {object} organization
 */
export const saveOrga = (
  organization: Partial<ApiOrganization>
): Promise<ModelWithId<ApiOrganization>> => {
  return new OrganizationModel(organization).save();
};

/**
 * @summary   Search for a single organization
 * @param     {object} params
 */
export const getOrganizationByParams = (
  params: FilterQuery<ApiOrganization>,
  session?: ClientSession
): Promise<OrganizationPopulate | null> => {
  if (params._id) {
    params._id = new mongoose.Types.ObjectId(params._id);
  }

  return OrganizationModel.findOne(params)
    .populate([
      { path: "users", select: USERS_FIELDS_FOR_POPULATE },
      { path: "places", select: PLACE_FIELDS_FOR_USERS },
      {
        path: "invitations",
        populate: { path: "user", select: USERS_FIELDS_FOR_POPULATE },
      },
      {
        path: "invitations",
        populate: { path: "organization", select: "_id organization_id" },
      },
    ])
    .session(session ?? null)
    .lean<OrganizationPopulate>()
    .exec();
};

/**
 * @summary Set whether an organization is verified
 * @param {object} organization
 */
export const setVerifiedToOrga = (
  organization: ApiOrganization
): Promise<ApiOrganization | null> => {
  return OrganizationModel.findOneAndUpdate<ApiOrganization>(
    { _id: organization._id },
    {
      $set: {
        verified: {
          date: organization.verified?.date || new Date(),
          status: true,
        },
      },
    },
    { new: true }
  )
    .lean()
    .exec();
};

export const pushElementInOrga = async (
  orgaObjectId: mongoose.Types.ObjectId[],
  element: string,
  elementIds: mongoose.Types.ObjectId[],
  session?: ClientSession
): Promise<void> => {
  await OrganizationModel.findOneAndUpdate<ApiOrganization>(
    { _id: { $in: orgaObjectId } },
    {
      $addToSet: {
        [element]: { $each: elementIds },
      },
    },
    { session }
  ).exec();
};

export const pullElementFromOrga = async (
  orgaObjectId: mongoose.Types.ObjectId[],
  element: string,
  elementIds: mongoose.Types.ObjectId[]
): Promise<void> => {
  await OrganizationModel.findOneAndUpdate<ApiOrganization>(
    { _id: { $in: orgaObjectId } },
    {
      $pull: {
        [element]: { $in: elementIds },
      },
    }
  ).exec();
};

export const updateOrga = (
  params: FilterQuery<ApiOrganization>,
  dataToUpdate: UpdateQuery<ApiOrganization>,
  session?: ClientSession
): Promise<OrganizationPopulate | null> => {
  return OrganizationModel.findOneAndUpdate<OrganizationPopulate | null>(
    params,
    { $set: dataToUpdate },
    { new: true, session }
  )
    .populate([
      { path: "places", select: PLACE_FIELDS_FOR_USERS },
      { path: "users", select: USERS_FIELDS_FOR_POPULATE },
      {
        path: "invitations",
        populate: { path: "user", select: USERS_FIELDS_FOR_POPULATE },
      },
      {
        path: "invitations",
        populate: { path: "organization", select: "_id organization_id" },
      },
    ])

    .lean<OrganizationPopulate>()
    .exec();
};

export const getNextOrgaId = async (): Promise<number> => {
  const lastOrga = await OrganizationModel.findOne()
    .sort({ organization_id: -1 })
    .select("organization_id")
    .lean()
    .exec();

  return lastOrga ? lastOrga.organization_id + 1 : 1;
};

export const countOrgas = (
  query: FilterQuery<ApiOrganization>
): Promise<number> => {
  if (query.places) {
    query.places["$in"].forEach(
      (placeObjectId: string) => new mongoose.Types.ObjectId(placeObjectId)
    );
  }

  return OrganizationModel.countDocuments(query).exec();
};

export const searchOrgas = (
  query: FilterQuery<ApiOrganization>,
  options: any = DEFAULT_SEARCH_OPTIONS
): Promise<OrganizationPopulate[]> => {
  return OrganizationModel.find<OrganizationPopulate>(query)
    .limit(options.limit)
    .skip(options.skip)
    .sort(options.sort)
    .collation({ locale: "fr", strength: 1 })
    .populate([
      { path: "users", select: USERS_FIELDS_FOR_POPULATE },
      { path: "places", select: PLACE_FIELDS_FOR_USERS },
      {
        path: "invitations",
        populate: { path: "user", select: USERS_FIELDS_FOR_POPULATE },
      },
      {
        path: "invitations",
        populate: { path: "organization", select: "_id organization_id" },
      },
    ])
    .lean<OrganizationPopulate[]>()
    .exec();
};

export const deleteOrgaWithParams = async (
  organization: OrganizationPopulate
): Promise<void> => {
  await OrganizationModel.findOneAndDelete({ _id: organization._id }).exec();
};

export const pullUserFromOrganization = (
  userObjectIds: mongoose.Types.ObjectId[],
  organizationObjectIds: mongoose.Types.ObjectId[],
  invitationObjectIds: mongoose.Types.ObjectId[],
  session?: ClientSession
): Promise<ModelWithId<ApiOrganization> | null> => {
  return OrganizationModel.findOneAndUpdate(
    { _id: { $in: organizationObjectIds } },
    {
      $pull: {
        users: { $in: userObjectIds },
        invitations: { $in: invitationObjectIds },
      },
    },
    { session }
  ).exec();
};

export const updateOrganizationAfterInvitation = async (
  organization: OrganizationPopulate,
  user: UserPopulateType,
  invitation: InvitationPopulate
): Promise<void> => {
  const counters = await countAccountsByRole(organization.organization_id);
  await OrganizationModel.updateOne<ApiOrganization>(
    { _id: organization._id },
    {
      $addToSet: {
        users: user._id,
      },
      $pull: {
        invitations: invitation._id,
      },
      $set: { verified: organization.verified, counters },
    }
  ).exec();
};
