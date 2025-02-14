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
import * as UserRightsService from "../services/userRights.service";

import { searchPlacesIds } from "../../search/services";

import {
  ModelWithId,
  OrganizationPopulate,
  User,
  UserPopulateType,
} from "../../_models";
import {
  ApiPlace,
  UserRightEditionPayload,
  UserStatus,
} from "@soliguide/common";
import { hasAdminAccessToPlace } from "../../_utils";
import { createUserRights } from "../utils";

export const getUserRightsForOrganization = async (
  organization: OrganizationPopulate
) => {
  return await UserRightsService.getUserRightsForOrganization(organization);
};

export const patchUserRights = async (
  user: UserPopulateType,
  organization: OrganizationPopulate,
  updateRightsData: UserRightEditionPayload
): Promise<OrganizationPopulate> => {
  await UserRightsService.deleteUserRightsWithParams({
    organization: organization._id,
    user: user._id,
  });

  const places = await searchPlacesIds(updateRightsData.places);

  const rightsToSave = createUserRights(
    user,
    organization,
    places,
    updateRightsData.role,
    updateRightsData.isInvitation
  );

  await UserRightsService.saveUserRights(rightsToSave);

  return organization;
};

export const canAddPlace = async (user: UserPopulateType): Promise<boolean> => {
  if (
    user.status === UserStatus.ADMIN_SOLIGUIDE ||
    user.status === UserStatus.ADMIN_TERRITORY ||
    user.status === UserStatus.SOLI_BOT
  ) {
    return true;
  }

  if (user.status === UserStatus.PRO) {
    return await UserRightsService.canAddPlace(user._id);
  }
  return false;
};

// Place or Soliguide admin
export const canDeletePlace = async (
  user: Pick<ModelWithId<User>, "_id" | "status" | "territories">,
  place: ApiPlace
): Promise<boolean> => hasAdminAccessToPlace(user, place);

export const canEditPlace = async (
  user: Pick<UserPopulateType, "_id" | "status" | "territories">,
  place: ApiPlace
): Promise<boolean> => {
  if (hasAdminAccessToPlace(user, place)) {
    return true;
  }

  return await UserRightsService.canEditPlace(user._id, place.lieu_id);
};
