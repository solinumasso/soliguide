import { NextFunction } from "express";
import {
  ExpressRequest,
  ExpressResponse,
  InvitationPopulate,
} from "../../_models";

import { hasAdminAccessToOrga } from "../../_utils/adminSolinum.functions";

import { getInvitationByToken } from "../../user/services/invitations.service";

import { countUserRights } from "../../user/services/userRights.service";
import { UserRole, UserRightStatus } from "@soliguide/common";

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
