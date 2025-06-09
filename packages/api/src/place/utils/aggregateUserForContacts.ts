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
  PlaceContact,
  PlaceContactForAdmin,
  UserRole,
  UserStatus,
} from "@soliguide/common";
import { UserRightUserPopulate, UserPopulate } from "../../user/interfaces";

const userStatuses = Object.values(UserStatus);

// Roles filtered by user, used in the professional directory pages
export const aggregateUsersForContactsEdition = (
  rightsFromDb: UserRightUserPopulate[],
  authUser: Pick<UserPopulate, "status" | "userRights" | "user_id">
): PlaceContactForAdmin[] => {
  if (!rightsFromDb) {
    return [];
  }
  const placeRights: PlaceContactForAdmin[] = [];
  const userIds: number[] = [];

  const isAdmin =
    authUser.status === UserStatus.ADMIN_SOLIGUIDE ||
    authUser.status === UserStatus.ADMIN_TERRITORY;

  const authUserRoleForOrga: { [key: string]: UserRole } = {};

  if (!isAdmin && authUser.userRights) {
    for (const userRights of authUser.userRights) {
      const organizationObjectId = userRights.organization;
      if (organizationObjectId) {
        authUserRoleForOrga[organizationObjectId.toString()] = userRights.role;
      }
    }
  }

  // Compare the user's organization with roles organizations
  for (const right of rightsFromDb) {
    if (!userIds.includes(right.user_id)) {
      userIds.push(right.user_id);

      const currentRight: PlaceContactForAdmin = {
        _id: right._id.toString(),
        canEdit: isAdmin,
        canEditUserInfos: isAdmin,
        displayContactPro: right.displayContactPro,
        lastname: right.user.lastname,
        mail: right.user.mail,
        name: right.user.name,
        phone: right.user?.phone ?? null,
        status: right.user.status as UserStatus,
        title: right.user?.title ?? null,
        userObjectId: right.user._id.toString(),
      };

      if (!isAdmin) {
        const currentRightRole: UserRole | null = Object.hasOwn(
          authUserRoleForOrga,
          right.organization.toString()
        )
          ? authUserRoleForOrga[right.organization.toString()]
          : null;

        if (
          userStatuses.indexOf(right.user.status as UserStatus) <=
          userStatuses.indexOf(authUser.status as UserStatus)
        ) {
          currentRight.canEdit = true;
          currentRight.canEditUserInfos =
            currentRightRole === UserRole.OWNER ||
            right.user_id === authUser.user_id;
        }
      }

      placeRights.push(currentRight);
    }
  }

  placeRights
    .sort((x, y) => {
      return x.canEditUserInfos === y.canEditUserInfos
        ? 0
        : x.canEditUserInfos
        ? -1
        : 1;
    })
    .sort((x, y) => {
      return x.canEdit === y.canEdit ? 0 : x.canEdit ? -1 : 1;
    });

  return placeRights;
};

export const aggregateUsersForContacts = (
  rightsFromDb: UserRightUserPopulate[]
): PlaceContact[] => {
  if (!rightsFromDb) {
    return [];
  }
  const placeRights: PlaceContact[] = [];
  const userIds: number[] = [];

  // Compare the user's organization with roles organizations
  for (const right of rightsFromDb) {
    if (right.displayContactPro && !userIds.includes(right.user_id)) {
      userIds.push(right.user_id);

      const currentRight: PlaceContact = {
        lastname: right.user.lastname,
        mail: right.user.mail,
        name: right.user.name,
        phone: right.user?.phone ?? null,
        title: right.user?.title ?? null,
      };

      placeRights.push(currentRight);
    }
  }

  return placeRights;
};
