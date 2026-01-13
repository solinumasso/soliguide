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
import { UserRole, UserRightStatus, ApiPlace } from "@soliguide/common";
import mongoose from "mongoose";
import { OrganizationPopulate, ModelWithId } from "../../_models";
import { UserRight } from "../interfaces";

export const createUserRights = (
  user: { user_id: number; _id: mongoose.Types.ObjectId },
  organization: Pick<OrganizationPopulate, "_id" | "organization_id">,
  places: Pick<ModelWithId<ApiPlace>, "_id" | "lieu_id">[],
  role: UserRole = UserRole.READER,
  isInvitation = false,
  displayContactPro = false
): UserRight[] => {
  const userRights: UserRight[] = [];

  if (places.length > 0) {
    for (const place of places) {
      userRights.push({
        displayContactPro,
        organization: organization._id,
        organization_id: organization.organization_id,
        place: place._id,
        place_id: place.lieu_id,
        role,
        status: isInvitation
          ? UserRightStatus.PENDING
          : UserRightStatus.VERIFIED,
        user: user._id,
        user_id: user.user_id,
      });
    }
  }

  // The right by default
  // Every user need a right with place and place_id as null
  // If any organization has 0 places, we have to keep a link between users and organizations
  userRights.push({
    displayContactPro,
    organization: organization._id,
    organization_id: organization.organization_id,
    place: null,
    place_id: null,
    role,
    status: isInvitation ? UserRightStatus.PENDING : UserRightStatus.VERIFIED,
    user: user._id,
    user_id: user.user_id,
  });

  return userRights;
};
