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
import { UserStatus } from "@soliguide/common";
import {
  ExpressRequest,
  SOLIGUIDE_HOSTNAME_REGEXP,
  CONFIG,
  FRONT_URLS,
  WEBAPP_URLS,
} from "../../../_models";
import { cleanUrl } from "./cleanUrl.service";
import { logger } from "../../../general/logger";
import { Origin } from "../../../_models/users/enums";

export const isMobileHeader = (req: ExpressRequest): boolean => {
  const userAgent = req.headers?.["user-agent"];
  return (
    !!userAgent?.startsWith("Soliguide Webview App") ||
    !!userAgent?.startsWith("Soliguide WebApp")
  );
};

export const handleOrigin = (req: ExpressRequest): string | null => {
  const requestOrigin = req.get("origin");
  const referer = req.get("referer");

  if (referer) {
    try {
      const cleanedReferer = cleanUrl(referer);
      if (!cleanedReferer) {
        return null;
      }

      const refererUrl = new URL(cleanedReferer);

      if (CONFIG.ENV === "dev") {
        return CONFIG.SOLIGUIDE_FR_URL;
      }

      if (SOLIGUIDE_HOSTNAME_REGEXP.test(refererUrl.origin)) {
        return refererUrl.origin;
      }
    } catch (e) {
      logger.error({ message: "CANNOT_GET_REFERER", error: e });
    }
  }

  return cleanUrl(requestOrigin);
};

export const handleOriginForLogs = (
  req: ExpressRequest,
  originFromReq: string | null
): Origin => {
  if (isMobileHeader(req)) {
    return Origin.MOBILE_APP;
  }

  if (req.user?.status === UserStatus.API_USER) {
    return Origin.API;
  }

  if (!originFromReq) {
    return CONFIG.ENV === "test"
      ? Origin.LOCALHOST_DEV
      : Origin.ORIGIN_UNDEFINED;
  }

  try {
    const cleanedOrigin = cleanUrl(originFromReq);
    if (!cleanedOrigin) {
      return Origin.ORIGIN_UNDEFINED;
    }

    const originUrl = new URL(originFromReq);
    const hostname = originUrl.hostname;

    if (hostname === "solinum.org") {
      return Origin.SOLINUM_ORG;
    }

    // Check if it's a webapp
    if (WEBAPP_URLS.some((url) => new URL(url).hostname === hostname)) {
      return Origin.WEBAPP_SOLIGUIDE;
    }

    // Check if it's a front
    if (FRONT_URLS.some((url) => new URL(url).hostname === hostname)) {
      return Origin.SOLIGUIDE;
    }

    if (hostname === new URL(CONFIG.WIDGET_URL).hostname) {
      return Origin.WIDGET_SOLIGUIDE;
    }

    if (CONFIG.ENV === "dev") {
      return Origin.LOCALHOST_DEV;
    }

    return Origin.ORIGIN_UNDEFINED;
  } catch (error) {
    req.log.warn(`Failed to parse origin URL ${originFromReq}: ${error}`);
    return Origin.ORIGIN_UNDEFINED;
  }
};
