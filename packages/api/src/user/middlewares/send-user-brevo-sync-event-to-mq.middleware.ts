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
import type {
  ExpressRequest,
  ExpressResponse,
  UserPopulateType,
} from "../../_models";
import {
  Exchange,
  RoutingKey,
  amqpEventsSender,
  AmqpSynchroBrevoUserEvent,
} from "../../events";

export const sendUserBrevoSyncToMq = async (
  req: ExpressRequest & {
    isUserDeleted: boolean;
    updatedUser: UserPopulateType;
  }
) => {
  if (req.updatedUser) {
    const payload = new AmqpSynchroBrevoUserEvent(
      req.updatedUser,
      req.requestInformation.frontendUrl,
      req.requestInformation.theme,
      req.isUserDeleted
    );

    await amqpEventsSender.sendToQueue<AmqpSynchroBrevoUserEvent>(
      Exchange.SYNCHRO_BREVO,
      `${RoutingKey.SYNCHRO_BREVO}.user`,
      payload,
      req.log
    );
  }
};

export const sendUserBrevoSyncToMqAndNext = async (
  req: ExpressRequest & {
    isUserDeleted: boolean;
    updatedUser: UserPopulateType;
  },
  _res: ExpressResponse,
  next: NextFunction
) => {
  sendUserBrevoSyncToMq(req);

  return next();
};
