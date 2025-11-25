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

import { ExpressRequest } from "../../_models";
import { PosthogClient } from "../../analytics/services";
import { TRACKED_EVENTS } from "../../analytics/constants";
import { InvitationPopulate, UserPopulateType } from "../interfaces";

const captureInvitationEvent = (
  req: ExpressRequest & { invitation: InvitationPopulate },
  event: string,
  userWhoInvited?: UserPopulateType
) => {
  PosthogClient.instance.capture({
    event,
    req,
    properties: {
      frontendUrl: req.requestInformation.frontendUrl,
      invitation_id: req.invitation._id,
      user_id: req.invitation.user_id,
      organization_id: req.invitation.organization_id,
      role: req.invitation.roleType,
      territories: req.invitation.territories,
      createdBy_id: userWhoInvited?._id
        ? userWhoInvited._id
        : req.invitation.createdBy,
    },
  });
};

export const captureSendInvitation = (
  req: ExpressRequest & { invitation: InvitationPopulate }
) => {
  captureInvitationEvent(
    req,
    TRACKED_EVENTS.API_SEND_INVITATION_EMAIL,
    req.user
  );
};

export const captureReSendInvitation = (
  req: ExpressRequest & { invitation: InvitationPopulate }
) => {
  captureInvitationEvent(req, TRACKED_EVENTS.API_RESEND_INVITATION_EMAIL);
};

export const captureWelcomeEvent = (
  req: ExpressRequest & { invitation: InvitationPopulate }
) => {
  captureInvitationEvent(req, TRACKED_EVENTS.API_SEND_WELCOME_EMAIL);
};
