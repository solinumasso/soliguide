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
import type { Logger } from "pino";

import type { Themes } from "@soliguide/common";

import type { ExpressRequest, ExpressResponse } from "../../_models";
import {
  Exchange,
  AmqpUserEvent,
  RoutingKey,
  amqpEventsSender,
} from "../../events";
import { isCampaignActive } from "../../campaign/controllers";
import { UserPopulateType } from "../interfaces";

const sendUserEventToMq = async (
  user: UserPopulateType,
  frontUrl: string,
  theme: Themes | null,
  routingKeySuffix: string,
  logger: Logger
) => {
  const payload = new AmqpUserEvent(
    user,
    frontUrl,
    theme,
    isCampaignActive(user.territories)
  );

  await amqpEventsSender.sendToQueue<AmqpUserEvent>(
    Exchange.USERS,
    `${RoutingKey.USERS}.${routingKeySuffix}`,
    payload,
    logger
  );
};

export const sendResetPasswordToMqAndNext = async (
  req: ExpressRequest & { selectedUser: UserPopulateType },
  _res: ExpressResponse,
  next: NextFunction
) => {
  await sendUserEventToMq(
    req.selectedUser,
    req.requestInformation.frontendUrl,
    req.requestInformation.theme,
    "reset-password",
    req.log
  );
  next();
};

export const sendResetedPasswordToMqAndNext = async (
  req: ExpressRequest & { selectedUser: UserPopulateType },
  _res: ExpressResponse,
  next: NextFunction
) => {
  await sendUserEventToMq(
    req.selectedUser,
    req.requestInformation.frontendUrl,
    req.requestInformation.theme,
    "reseted-password",
    req.log
  );
  next();
};
