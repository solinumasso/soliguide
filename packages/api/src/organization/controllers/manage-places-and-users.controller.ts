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
  ApiPlace,
  CAMPAIGN_DEFAULT_NAME,
  CountryCodes,
  getPosition,
  UserRole,
} from "@soliguide/common";
import mongoose from "mongoose";
import {
  UserPopulateType,
  OrganizationPopulate,
  ModelWithId,
  Invitation,
  UserRight,
} from "../../_models";
import { getMongoId } from "../../_utils/functions/mongo";
import { updateOrganizationCampaign } from "../../campaign/controllers";
import {
  getNbPlacesToUpdate,
  getNbPriorityPlaces,
} from "../../campaign/services/places.service";
import {
  deleteUserRights,
  updateUsersAfterRemovedFromOrganization,
  deleteInvitationWithParams,
  updateOrganizationCounters,
  getOrganizationUserRights,
  saveUserRights,
} from "../../user/services";
import {
  pullUserFromOrganization,
  pushElementInOrga,
  updateOrga,
  getOrganizationByParams,
  pullElementFromOrga,
} from "../services";
import { mongooseConnection } from "../../config/database/connection";

/**
 * @summary removeUser - remove user from organization
 * @param {object} user
 * @param {object} organization
 */
export const removeUserFromOrga = async (
  user: UserPopulateType,
  organization: OrganizationPopulate
): Promise<OrganizationPopulate | null> => {
  const invitationsToUpdate: mongoose.Types.ObjectId[] =
    organization.invitations
      .filter(
        (invitation: ModelWithId<Invitation>) =>
          invitation.user._id.toString() === user._id.toString()
      )
      .map((invitation: ModelWithId<Invitation>) => invitation._id);

  const session = await mongooseConnection.startSession();
  session.startTransaction();

  try {
    // Delete user role related to this organization
    await deleteUserRights({
      organization: organization._id,
      user: user._id,
      session,
    });

    await updateUsersAfterRemovedFromOrganization(
      [user._id],
      [organization._id],
      invitationsToUpdate,
      session
    );

    await pullUserFromOrganization(
      [user._id],
      [organization._id],
      invitationsToUpdate,
      session
    );

    await deleteInvitationWithParams({
      organization: organization._id,
      user: user._id,
      session,
    });

    await session.commitTransaction();

    const updatedOrga = await updateOrganizationCounters(
      organization.organization_id,
      session
    );

    return updatedOrga;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * @summary Add a place to an organization
 * @param {object} place
 * @param {object} organization
 */
export const addPlaceToOrga = async (
  place: ModelWithId<ApiPlace>,
  organization: OrganizationPopulate
): Promise<OrganizationPopulate | null> => {
  const session = await mongooseConnection.startSession();
  session.startTransaction();

  try {
    // 0. Link the place to the organization
    await pushElementInOrga([organization._id], "places", [place._id], session);
    const placeObjectId = place._id?.toString();

    // We check whether the new place has to be updated in the update campaign
    const position = getPosition(place);

    if (position?.country === CountryCodes.FR) {
      if (await getNbPlacesToUpdate([placeObjectId])) {
        await updateOrga(
          { _id: organization._id },
          { [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: true },
          session
        );
        await updateOrganizationCampaign(place._id, session);
      }

      // We check whether the new place is a priority place
      if (await getNbPriorityPlaces([placeObjectId])) {
        await updateOrga(
          { _id: organization._id },
          { priority: true },
          session
        );
      }
    }

    // 1. Get roles ID

    const organizationUserRights = await getOrganizationUserRights(
      organization,
      session
    );

    // If there's no role, it means a place is added to an organization which never had invitations before
    if (organizationUserRights.length > 0) {
      const globalRights = organizationUserRights.filter(
        (userRight) =>
          userRight.role === UserRole.OWNER ||
          userRight.role === UserRole.READER
      );

      if (globalRights.length > 0) {
        const userRights: UserRight[] = globalRights.map((userRight) => ({
          displayContactPro: false,
          organization: organization._id,
          organization_id: organization.organization_id,
          place: place._id,
          place_id: place.lieu_id,
          role: userRight.role,
          status: userRight.status,
          user: userRight.user._id,
          user_id: userRight.user_id,
        }));

        // 2. Create the rights
        await saveUserRights(userRights, session, false);
      }
    }
    await session.commitTransaction();

    return await getOrganizationByParams(
      {
        _id: organization._id,
      },
      session
    );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * @summary Remove a place from an organization
 * @param {object} place
 * @param {object} organization
 */
export const removePlaceFromOrga = async (
  organization: OrganizationPopulate,
  place: ModelWithId<ApiPlace>
): Promise<OrganizationPopulate | null> => {
  await deleteUserRights({
    organization: organization._id,
    place: place._id,
  });

  await pullElementFromOrga([organization._id], "places", [place._id]);

  let updatedOrga = await getOrganizationByParams({
    _id: organization._id,
  });

  if (!updatedOrga) {
    throw new Error("No organization to update");
  }

  const placeObjectIds: mongoose.Types.ObjectId[] = updatedOrga.places.map(
    (place: ApiPlace) => getMongoId(place._id)
  );

  // We check whether the organization contains places to update during the update campaign
  let toUpdate = false;
  let priority = false;

  if (updatedOrga.places?.length > 0) {
    toUpdate = (await getNbPlacesToUpdate(placeObjectIds)) > 0;
    priority = (await getNbPriorityPlaces(placeObjectIds)) > 0;
  }

  // We check that the organization still contains priority places
  updatedOrga = await updateOrga(
    { _id: updatedOrga._id },
    { [`campaigns.${CAMPAIGN_DEFAULT_NAME}.toUpdate`]: toUpdate, priority }
  );

  await updateOrganizationCounters(organization.organization_id);
  await updateOrganizationCampaign(place._id);

  return updatedOrga;
};
