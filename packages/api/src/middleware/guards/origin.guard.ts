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
import { ExpressRequest, ExpressResponse, Origin } from "../../_models";
import { captureException, getCurrentScope } from "@sentry/node";

export const originGuard = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  const userOrigin = req.requestInformation.originForLogs;

  if (userOrigin === Origin.ORIGIN_UNDEFINED) {
    // Not logged to a valid domain
    const message = {
      CONTENT: userOrigin,
      REQUEST_BODY: req.body,
      REFERER: req.requestInformation.referer,
      ORIGIN: req.requestInformation.originForLogs,
      REQUEST_HEADERS: req.headers,
      STATUS: "API_CONNECTION_ATTEMPT",
    };
    captureException(new Error(JSON.stringify(message)));
    return res.status(403).send({ message: "FORBIDDEN_API_USER" });
  }
  getCurrentScope().setUser(req.user);

  next();
};
