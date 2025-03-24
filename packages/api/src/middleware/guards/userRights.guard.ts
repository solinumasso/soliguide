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
import { NextFunction } from "express";

import { UserRightStatus, UserStatus } from "@soliguide/common";

import {
  ExpressRequest,
  ExpressResponse,
  UserRightUserPopulate,
} from "../../_models";

import { USER_ROLES_FOR_EDITION } from "../../user/constants";
import mongoose, { isValidObjectId } from "mongoose";
import { getUserRightsById } from "../../user/services";

export const canGetContact = async (
  req: ExpressRequest & {
    selectedUserRight: UserRightUserPopulate;
  },
  res: ExpressResponse,
  next: NextFunction
) => {
  if (
    !req.params.userRightObjectId ||
    !isValidObjectId(req.params.userRightObjectId)
  ) {
    return res.status(400).send({ message: "ROLE_ID_NOT_EXIST" });
  }

  let userRight: UserRightUserPopulate | null = null;

  if (req.isAdmin) {
    userRight = await getUserRightsById({
      _id: new mongoose.Types.ObjectId(req.params.userRightObjectId),
    });
  } else if (req.user.status === UserStatus.PRO) {
    userRight = await getUserRightsById({
      _id: new mongoose.Types.ObjectId(req.params.userRightObjectId),
    });

    if (userRight) {
      const placeRight = await getUserRightsById({
        organization_id: userRight.organization_id,
        place_id: userRight.place_id,
        user: req.user._id,
        role: { $in: USER_ROLES_FOR_EDITION },
        status: UserRightStatus.VERIFIED,
      });

      if (!placeRight) {
        userRight = null;
      }
    }
  }

  if (userRight) {
    req.selectedUserRight = userRight;
    next();
  } else {
    return res.status(403).send({ message: "FORBIDDEN_USER" });
  }
};
