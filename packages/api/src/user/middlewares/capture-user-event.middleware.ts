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

import { PosthogClient } from "../../analytics/services";
import { TRACKED_EVENTS } from "../../analytics/constants";
import { ExpressRequest } from "../../_models";
import { UserPopulateType } from "../interfaces";

const captureUserEvent = (
  req: ExpressRequest & { selectedUser: UserPopulateType },
  event: string
) => {
  PosthogClient.instance.capture({
    event,
    req,
    properties: {
      frontendUrl: req.requestInformation.frontendUrl,
      user_id: req.selectedUser.user_id,
      territories: req.selectedUser.territories,
    },
  });
};

export const capturePasswordReset = (
  req: ExpressRequest & { selectedUser: UserPopulateType }
) => {
  captureUserEvent(req, TRACKED_EVENTS.API_SEND_PASSWORD_RESET_EMAIL);
};

export const capturePasswordResetToken = (
  req: ExpressRequest & { selectedUser: UserPopulateType }
) => {
  captureUserEvent(req, TRACKED_EVENTS.API_RESEND_INVITATION_EMAIL);
};
