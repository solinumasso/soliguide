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
import express, { type NextFunction } from "express";

import { UserStatus, validateUserStatusWithEmail } from "@soliguide/common";

import { emailValidDto, inviteUserDto, signupAfterInvitationDto } from "../dto";
import {
  ExpressRequest,
  ExpressResponse,
  InvitationPopulate,
  UserPopulateType,
} from "../../_models";

import {
  getInvitationFromUrl,
  canManageInvitation,
  getFilteredData,
  canEditOrga,
  getOrgaFromUrl,
  getOrgaFromBody,
} from "../../middleware";

import {
  acceptFirstInvitation,
  createUserWithInvitation,
  deleteInvitation,
  validateInvitation,
} from "../controllers/invite-user.controller";
import { isUserInOrga } from "../controllers/user.controller";
import {
  sendAcceptedInvitationToMq,
  sendAcceptedInvitationToMqAndNext,
  sendDeteleInvitationToMq,
  sendNewInvitationToMqAndNext,
  sendReNewInvitationToMqAndNext,
  sendWelcomeToMqAndNext,
} from "../middlewares/send-inivitation-event-to-mq.middleware";
import {
  captureReSendInvitation,
  captureSendInvitation,
  captureWelcomeEvent,
} from "../middlewares/capture-inivitation-event.middleware";
import {
  sendUserChangesToMq,
  sendUserChangesToMqAndNext,
} from "../middlewares/send-user-changes-event-to-mq.middleware";

const router = express.Router();

/**
 * @swagger
 *
 * POST /invite-user
 * @summary   Invite a user who does not exist yet
 * @security  BasicAuth
 * @return    {object}  200 - success response - application/json
 */
router.post(
  "/",
  getOrgaFromBody,
  canEditOrga,
  inviteUserDto,
  getFilteredData,
  async (
    req: ExpressRequest & {
      invitation: InvitationPopulate;
    },
    res: ExpressResponse,
    next: NextFunction
  ) => {
    const userData = req.bodyValidated;

    try {
      if (
        validateUserStatusWithEmail(UserStatus.PRO, userData?.mail) !== null
      ) {
        return res.status(403).json({ message: "SIGNUP_IMPOSSIBLE" });
      }
      const invitation = await createUserWithInvitation(
        userData,
        req.user,
        req.organization
      );

      if (invitation) {
        req.invitation = invitation;
        req.updatedUser = req.invitation.user as UserPopulateType;
      } else {
        throw new Error("INVITATION WASN'T CREATED");
      }
      return next();
    } catch (e) {
      req.log.error(e, "CREATE_INVITATION_FAIL");
      return res.status(500).json({ message: "CREATE_INVITATION_FAIL" });
    }
  },
  sendNewInvitationToMqAndNext,
  (
    _req: ExpressRequest & {
      invitation: InvitationPopulate;
    },
    res: ExpressResponse,
    next: NextFunction
  ) => {
    res.status(200).json({ message: "INVITE_SENT" });
    return next();
  },
  sendUserChangesToMqAndNext,
  captureSendInvitation
);

/**
 * @swagger
 *
 * DELETE     /invite-user/:invitationToken
 * @summary   Delete an invitation
 * @param     {string}   invitationToken
 */
router.delete(
  "/:invitationToken",
  getInvitationFromUrl,
  canManageInvitation,
  async (
    req: ExpressRequest & {
      invitation: InvitationPopulate;
    },
    res: ExpressResponse,
    next: NextFunction
  ) => {
    try {
      await deleteInvitation(req.invitation);
      res.status(200).json({ message: "OK" });

      return next();
    } catch (e) {
      req.log.error(e, "DELETE_INVITATION_FAIL");
      return res.status(400).json({ message: "DELETE_INVITATION_FAIL" });
    }
  },
  sendDeteleInvitationToMq
);

/**
 * @swagger
 *
 * GET        /invite-user/infos/invitationToken:
 * @summary   Returns the invitation information
 * @param     {string}   invitationToken
 */
router.get(
  "/infos/:invitationToken",
  getInvitationFromUrl,
  async (
    req: ExpressRequest & {
      invitation: InvitationPopulate;
    },
    res: ExpressResponse
  ) => {
    return res.status(200).json(req.invitation);
  }
);

/**
 * @swagger
 *
 * GET        /invite-user/validate/invitationToken:
 * @summary   Validate an invitation for an existing account
 * @param     {string}  invitationToken
 */
router.get(
  "/validate/:invitationToken",
  getInvitationFromUrl,
  async (
    req: ExpressRequest & {
      invitation: InvitationPopulate;
    },
    res: ExpressResponse,
    next: NextFunction
  ) => {
    try {
      const updatedUser = await validateInvitation(req.invitation);

      req.selectedUser = updatedUser;

      req.updatedUser = updatedUser;

      res.status(200).json(updatedUser);

      return next();
    } catch (e) {
      req.log.error(e, "VALIDATION_INVITATION_FAIL");
      return res.status(400).json({ message: "VALIDATION_INVITATION_FAIL" });
    }
  },
  sendAcceptedInvitationToMq,
  sendUserChangesToMq
);

/**
 * @swagger
 *
 * GET        /invite-user/accept-first-invitation/:invitationToken
 * @summary   Validate an invitation with a change in the account information
 * @param     {string}   invitationToken
 */
router.post(
  "/accept-first-invitation/:invitationToken",
  getInvitationFromUrl,
  signupAfterInvitationDto,
  getFilteredData,
  async (
    req: ExpressRequest & {
      invitation: InvitationPopulate;
    },
    res: ExpressResponse,
    next: NextFunction
  ) => {
    const userSignupInfos = req.bodyValidated;
    try {
      const user = await acceptFirstInvitation(
        req.invitation,
        userSignupInfos.password
      );
      // sendWelcomeToMqAndNext needs the updated user in the invitation
      req.invitation.user = user;
      req.selectedUser = user;
      req.organization = req.invitation.organization;

      res.status(200).json(user._id.toString());

      next();
    } catch (e) {
      req.log.error(e, "ACCEPT_FIRST_INVITATION_FAIL");
      res.status(500).json({ message: "ACCEPT_FIRST_INVITATION_FAIL" });
    }
  },
  sendWelcomeToMqAndNext,
  sendAcceptedInvitationToMqAndNext,
  sendUserChangesToMqAndNext,
  captureWelcomeEvent
);

/**
 * @swagger
 *
 * GET        /invite-user/resend/:orgaObjectId/:invitationToken:
 * @summary   Re-send an invitation email
 * @param     {string}    orgaObjectId
 * @param     {string}    invitationToken
 */
router.get(
  "/resend/:orgaObjectId/:invitationToken",
  getOrgaFromUrl,
  canEditOrga,
  getInvitationFromUrl,
  canManageInvitation,
  sendReNewInvitationToMqAndNext,
  (_req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    res.status(200).json({ message: "RESEND_DONE" });
    return next();
  },
  captureReSendInvitation
);

/**
 * @swagger
 *
 * /users/test-email-exist-orga/:orgaObjectId:
 *   post:
 *     description: check if a user is already in an organization
 *     tags: [Users]
 *     parameters:
 *       - name: mail
 *         in: body
 *         required: true
 *         type: string
 *       - name: organization_id
 *         in: body
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: boolean true if the user is already in the orga, false otherwise
 *       400 :
 *         description: TEST_EMAIL_FAIL
 */
router.post(
  "/test-email-exist-orga/:orgaObjectId",
  getOrgaFromUrl,
  canEditOrga,
  emailValidDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const result = await isUserInOrga(
        req.bodyValidated.mail,
        req.organization
      );
      return res.status(200).json(result);
    } catch (e) {
      req.log.error(e, "/test-email-exist");
      return res.status(400).json({ message: "TEST_EMAIL_FAIL" });
    }
  }
);

export default router;
