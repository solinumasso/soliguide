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

import { DEFAULT_USER_PROPS } from "../constants";

import { ModelWithId, OrganizationPopulate } from "../../_models";

import { hashPassword, generateUrlToken } from "../../_utils";

import { createUserRights, mergeOperationalAreas } from "../utils";
import {
  ApiPlace,
  CountryCodes,
  UserRole,
  UserStatus,
} from "@soliguide/common";

import { getPlaceByParams } from "../../place/services/place.service";
import {
  getOrganizationByParams,
  pushElementInOrga,
  updateOrganizationAfterInvitation,
  pullUserFromOrganization,
} from "../../organization/services";
import {
  saveUserRights,
  validateUserRights,
  deleteUserRights,
  getUserByParams,
  updateUser,
  createUser,
  pushElementInUser,
  updateUserAfterInvitation,
  updateUsersAfterRemovedFromOrganization,
  createInvitation,
  updateInvitationWithParams,
  deleteInvitationWithParams,
} from "../services";
import { mongooseConnection } from "../../config/database/connection";
import { extractTerritoriesFromAreasForCountry } from "../utils/getTerritoriesFromAreas";
import {
  UserPopulateType,
  InvitationPopulate,
  SignupUser,
  User,
} from "../interfaces";
import { UserToInvite } from "../types";

export const createUserWithInvitation = async (
  userToInvite: UserToInvite,
  userWhoInvites: UserPopulateType,
  organization: OrganizationPopulate
): Promise<InvitationPopulate> => {
  const session = await mongooseConnection.startSession();
  session.startTransaction();

  try {
    // Whether this email already exist
    const existingUser = await getUserByParams(
      {
        mail: userToInvite.mail,
      },
      session
    );

    let user: UserPopulateType;

    if (existingUser) {
      const updatedUser = await updateUser(
        { _id: existingUser._id },
        {
          areas: mergeOperationalAreas(
            organization?.areas,
            existingUser?.areas
          ),
        },
        session
      );

      if (!updatedUser) {
        throw new Error(
          `Failed to update existing user territories (_id: ${existingUser._id})`
        );
      }
      user = updatedUser;
    } else {
      const userToCreate: SignupUser &
        Omit<User, "user_id" | "updatedAt" | "createdAt"> & {
          country: CountryCodes;
        } = {
        ...DEFAULT_USER_PROPS,
        country: userToInvite.country,
        lastname: userToInvite.lastname,
        mail: userToInvite.mail,
        name: userToInvite.name,
        password: generateUrlToken(),
        status: UserStatus.PRO,
        territories: extractTerritoriesFromAreasForCountry(
          organization.areas,
          userToInvite.country
        ),
        areas: organization.areas,
      };

      userToCreate.phone = userToInvite.phone ?? null;
      userToCreate.title = userToInvite.title ?? null;

      const createdUser = await createUser(userToCreate, session);

      if (!createdUser) {
        throw new Error(
          `Failed to create user with email ${userToCreate.mail}`
        );
      }

      user = createdUser;
    }

    // Depending on the status we do not choose the same source:
    // Editor = places chosen in the form
    // Owner = all organization places
    const role = userToInvite.role;
    const places =
      role === UserRole.EDITOR ? userToInvite.places : organization.places;

    const tmpPlaces: Pick<ModelWithId<ApiPlace>, "_id" | "lieu_id">[] = [];

    for (const place of places) {
      const newPlace =
        role === UserRole.EDITOR
          ? await getPlaceByParams({ _id: place }, session)
          : place;

      const key = {
        _id: newPlace._id,
        lieu_id: newPlace.lieu_id,
      };

      if (
        !tmpPlaces
          .map((key) => JSON.stringify(key))
          .includes(JSON.stringify(key))
      )
        tmpPlaces.push(key);
    }

    const userRightsToSave = createUserRights(
      user,
      organization,
      tmpPlaces,
      role,
      true
    );

    await saveUserRights(userRightsToSave, session);

    const newInvitation: InvitationPopulate = await createInvitation(
      userWhoInvites,
      organization,
      user,
      role,
      userToInvite.country,
      session
    );

    await pushElementInOrga(
      [organization._id],
      "invitations",
      [newInvitation._id],
      session
    );

    await pushElementInUser(
      [user._id],
      "invitations",
      [newInvitation._id],
      session
    );

    await session.commitTransaction();
    return newInvitation;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const validateInvitation = async (
  invitation: InvitationPopulate
): Promise<UserPopulateType> => {
  const newInvitation = await updateInvitationWithParams(
    { token: invitation.token },
    { acceptedAt: new Date(), pending: false }
  );

  if (!newInvitation) {
    throw new Error(`Failed to create invitation ${invitation?._id}`);
  }

  const organization = await getOrganizationByParams({
    _id: newInvitation.organization._id,
  });

  if (!organization) {
    throw new Error(
      `[ValidateInvitation] Organization not found: _id ${newInvitation.organization._id}`
    );
  }

  // STEP 2: validate user rights
  const rights = await validateUserRights(
    newInvitation.user._id,
    newInvitation.organization._id
  );

  if (rights[0].role === UserRole.OWNER && !organization.verified?.status) {
    organization.verified = {
      date: new Date(),
      status: true,
    };
  }

  // Step 3: update the user
  const updatedUser = await updateUserAfterInvitation(
    organization,
    newInvitation.user._id,
    newInvitation._id
  );

  if (!updatedUser) {
    throw new Error(`Failed to update user ${newInvitation.user._id}`);
  }

  // Step 4: update the organization
  await updateOrganizationAfterInvitation(
    organization,
    updatedUser,
    newInvitation
  );

  if (!updatedUser) {
    throw new Error(`Failed to update user ${newInvitation.user._id}`);
  }
  updatedUser.userRights = rights;
  return updatedUser;
};

export const acceptFirstInvitation = async (
  invitation: InvitationPopulate,
  userPassword: string
): Promise<UserPopulateType> => {
  const userObjectId = invitation.user._id;

  const user: Partial<User> = {
    password: await hashPassword(userPassword),
    verifiedAt: new Date(),
  };

  const updatedUser = await updateUser({ _id: userObjectId }, user);

  if (!updatedUser) {
    throw new Error(`Failed to update password of user ${userObjectId}`);
  }

  return await validateInvitation(invitation);
};

export const deleteInvitation = async (invitation: InvitationPopulate) => {
  await deleteUserRights({
    organization: invitation.organization._id,
    user: invitation.user._id,
  });

  await updateUsersAfterRemovedFromOrganization(
    [invitation.user._id],
    [invitation.organization._id],
    [invitation._id]
  );

  await pullUserFromOrganization(
    [invitation.user._id],
    [invitation.organization._id],
    [invitation._id]
  );

  await deleteInvitationWithParams({
    token: invitation.token,
  });
};
