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
import { ApiOrganization, UserRightStatus, UserRole } from "@soliguide/common";
import { UserPopulateType, UserRight } from "../../_models";

export const aggregateUserRightsForAuth = (
  user: UserPopulateType,
  organizationId?: string
): {
  role: UserRole;
  places: number[];
} => {
  if (!user.userRights) {
    return {
      role: UserRole.READER,
      places: [],
    };
  }
  let role: UserRole = UserRole.READER;
  const places: number[] = [];
  const selectedOrganization: ApiOrganization =
    user.organizations?.[user.selectedOrgaIndex];

  const orgId = organizationId || selectedOrganization?.organization_id;

  const tmpUserRights = user.userRights.filter(
    (userRight: UserRight) =>
      userRight.status === UserRightStatus.VERIFIED &&
      userRight.organization_id === orgId
  );

  if (tmpUserRights?.length) {
    role = tmpUserRights[0].role;

    tmpUserRights.forEach((userRight: UserRight) => {
      if (userRight.place_id !== null) {
        places.push(userRight.place_id as number);
      }
    });
  }

  return {
    places,
    role,
  };
};
