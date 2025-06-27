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
import { ExpressRequest, ExpressResponse } from "../../_models";

import { hasAdminAccessToOrga } from "../../_utils/adminSolinum.functions";

import { getInvitationByToken } from "../../user/services/invitations.service";

import { countUserRights } from "../../user/services/userRights.service";
import { UserRole, UserRightStatus } from "@soliguide/common";
import { InvitationPopulate } from "../../user/interfaces";

export const canManageInvitation = async (
  req: ExpressRequest & {
    invitation: InvitationPopulate;
  },
  res: ExpressResponse,
  next: NextFunction
) => {
  if (!req.user.isLogged()) {
    return res.status(403).send({ message: "FORBIDDEN_USER" });
  }

  if (hasAdminAccessToOrga(req.user, req.invitation.organization)) {
    next();
  } else {
    const userRightsCount = await countUserRights({
      organization: req.invitation.organization._id,
      role: UserRole.OWNER,
      status: UserRightStatus.VERIFIED,
      user: req.user._id,
    });

    if (userRightsCount === 0) {
      return res.status(403).send({ message: "FORBIDDEN_USER" });
    }
    next();
  }
  return null;
};

export const getInvitationFromUrl = async (
  req: ExpressRequest & {
    invitation: InvitationPopulate;
  },
  res: ExpressResponse,
  next: NextFunction
) => {
  if (!req.params.invitationToken || req.params.invitationToken === "null") {
    return res.status(400).send({ message: "INVITATION_NOT_EXIST" });
  }

  try {
    const invitation = await getInvitationByToken(req.params.invitationToken);
    if (!invitation) {
      return res.status(400).send({ message: "INVITATION_NOT_EXIST" });
    }
    req.invitation = invitation;
    next();
  } catch (e) {
    return res.status(400).send({ message: "INVITATION_NOT_EXIST" });
  }
  return null;
};
