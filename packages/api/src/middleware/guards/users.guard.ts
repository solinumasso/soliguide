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
import type { NextFunction } from "express";
import mongoose from "mongoose";
import { UserRightStatus, UserRole, UserStatus } from "@soliguide/common";

import type { ExpressRequest, ExpressResponse } from "../../_models";
import { hasAdminAccessToOrga } from "../../_utils";
import {
  getUserByIdWithUserRights,
  countUserRights,
} from "../../user/services";
import { UserPopulateType } from "../../user/interfaces";

export const canEditUser = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  if (
    req.user.isLogged() &&
    req.selectedUser &&
    (await canGetOrEditUser(req.user, req.selectedUser))
  ) {
    next();
  } else {
    res.status(403).send({ message: "FORBIDDEN_USER" });
  }
};

export const getUserFromUrl = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  if (
    !req.params.userObjectId ||
    req.params.userObjectId === "null" ||
    !mongoose.Types.ObjectId.isValid(req.params.userObjectId)
  ) {
    return res.status(400).send({ message: "USER_ID_NOT_EXIST" });
  }

  const userObjectId = req.params.userObjectId;

  try {
    const user = await getUserByIdWithUserRights(userObjectId);
    if (user) {
      req.selectedUser = user;
      return next();
    }
  } catch (e) {
    req.log.error(e);
  }
  return res.status(400).send({ message: "USER_NOT_EXIST" });
};

export const canGetOrEditUser = async (
  authUser: UserPopulateType,
  selectedUser: UserPopulateType
): Promise<boolean> => {
  // Soliguide admin = root
  if (hasAdminAccessToOrga(authUser, selectedUser)) {
    return true;
  }

  // I'm editing myself
  if (authUser.user_id === selectedUser.user_id) {
    return true;
  }

  // Impossible to edit a Solinum user
  if (
    selectedUser.status === UserStatus.ADMIN_SOLIGUIDE ||
    selectedUser.status === UserStatus.ADMIN_TERRITORY
  ) {
    return false;
  }

  // Pro account
  if (authUser.status === UserStatus.PRO) {
    // Organization list by  ID
    const organizationIdMap: mongoose.Types.ObjectId[] = [];
    const organizationIdMapString: string[] = [];

    for (const organization of selectedUser.organizations) {
      const organizationObjectId = organization._id.toString();

      if (
        organizationObjectId &&
        !organizationIdMapString.includes(organizationObjectId)
      ) {
        organizationIdMap.push(
          new mongoose.Types.ObjectId(organizationObjectId)
        );
        organizationIdMapString.push(organizationObjectId);
      }
    }

    for (const invitation of selectedUser.invitations) {
      const castedInvitation = invitation;
      if (
        !organizationIdMapString.includes(
          castedInvitation.organization._id.toString()
        )
      ) {
        organizationIdMap.push(castedInvitation.organization._id);
        organizationIdMapString.push(
          castedInvitation.organization._id.toString()
        );
      }
    }

    // 0. Get userRights ID
    const userRights = await countUserRights({
      organization: { $in: organizationIdMap },
      role: UserRole.OWNER,
      status: UserRightStatus.VERIFIED,
      user: authUser._id,
    });

    return userRights > 0;
  }
  return false;
};
