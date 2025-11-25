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
  CountryAreaTerritories,
  PostOrganizationPayload,
  SearchResults,
} from "@soliguide/common";

import isEqual from "lodash.isequal";

import mongoose from "mongoose";

import {
  countOrgas,
  createOrgaSearchQuery,
  deleteOrgaWithParams,
  getNextOrgaId,
  saveOrga,
  searchOrgas,
  updateOrga,
} from "../services";

import { ModelWithId, OrganizationPopulate } from "../../_models";

import { generateSearchOptions } from "../../search/utils";
import {
  updateUsersTerritories,
  deleteUserRights,
  deleteInvitationWithParams,
  updateUsersAfterRemovedFromOrganization,
} from "../../user/services";
import { UserForSearch } from "../../user/types";
import { Invitation, User } from "../../user/interfaces";

/**
 * createOrganization - Create organization
 * @param {Object} organizationPayload - All information about organization (CF Mongoose Organization Model)
 */
export const createOrganization = async (
  organizationPayload: PostOrganizationPayload
): Promise<ModelWithId<ApiOrganization>> => {
  const newOrgaId = await getNextOrgaId();

  const createdOrga: Partial<ApiOrganization> = {
    ...organizationPayload,
    organization_id: newOrgaId,
    phone: organizationPayload.phone ?? null,
    places: [],
    website: organizationPayload.website ?? null,
    areas: {
      [organizationPayload.country]: new CountryAreaTerritories({
        departments: organizationPayload.territories,
      }),
    },
  };

  return saveOrga(createdOrga);
};

/**
 * @summary    Search for organizations
 * @param      {object} query search object
 * @param      {object} user User qui recherche
 */
export const searchOrga = async (
  query: mongoose.FilterQuery<ApiOrganization>,
  user: UserForSearch
): Promise<SearchResults<OrganizationPopulate>> => {
  const mongoSearchQuery = await createOrgaSearchQuery(query, user);

  const nbResults = await countOrgas(mongoSearchQuery);

  const options = generateSearchOptions(nbResults, query.options);
  const results = await searchOrgas(mongoSearchQuery, options);

  return {
    nbResults,
    results,
  };
};

/**
 * @summary Patch an organization
 * @param {Number} organization Organization object
 * @param {Object} dataToUpdate Organization object
 */
export const patchOrganization = async (
  organization: OrganizationPopulate,
  dataToUpdate: Partial<ApiOrganization>
): Promise<OrganizationPopulate> => {
  const updatedOrga = await updateOrga({ _id: organization._id }, dataToUpdate);

  if (!updatedOrga) {
    throw new Error("No organization to update");
  }

  // Do not update users & invitations if territories dit not change
  if (!isEqual(organization.areas, updatedOrga?.areas)) {
    const users = updatedOrga.users;

    // Update territories of this organization users
    for (const user of users) {
      await updateUsersTerritories(user._id);
    }
  }

  return updatedOrga;
};

/**
 * @summary Delete an organization
 * @param {object} organization
 */
export const removeOrganization = async (
  organization: OrganizationPopulate
): Promise<void> => {
  await deleteUserRights({
    organization: organization._id,
  });

  await deleteInvitationWithParams({
    organization: organization._id,
  });

  const invitationsToUpdate: mongoose.Types.ObjectId[] =
    organization.invitations.map(
      (invitation: ModelWithId<Invitation>) => invitation._id
    );

  const usersToUpdate: mongoose.Types.ObjectId[] = organization.users.map(
    (user: ModelWithId<User>) => user._id
  );

  await updateUsersAfterRemovedFromOrganization(
    usersToUpdate,
    [organization._id],
    invitationsToUpdate
  );

  // Return the deleted organization
  await deleteOrgaWithParams(organization);
};
