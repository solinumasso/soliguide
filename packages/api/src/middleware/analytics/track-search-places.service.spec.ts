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
import "../../config/database/connection";
import "../../place/models/place.model";
import { SupportedLanguagesCode } from "@soliguide/common";

import { getUserForLogs } from "../logging";

import { ExpressRequest, Origin, UserPopulateType } from "../../_models";

import { generateFullName } from "../../_utils";

import {
  USER_ADMIN_SOLIGUIDE,
  USER_PRO,
  ORIGIN_SOLIGUIDE_REQUEST,
  ORIGIN_SOLINUM_ORG_REQUEST,
} from "../../../mocks";
import { LogSearchPlaces } from "../../logging/interfaces";

import {
  getSearchPropertiesFromRequest,
  trackSearchPlaces,
} from "./track-search-places.service";
import { TRACKED_EVENTS } from "../../analytics/constants";
import { PosthogClient } from "../../analytics/services";

jest.useFakeTimers();

const posthogInstance = PosthogClient.instance;

describe("To test the trackSearchPlaces middleware", () => {
  const trackedEvent = TRACKED_EVENTS.API_SEARCH_PLACES;
  const distinctId = "michel";
  const sessionId = "isabelle";

  const posthogCapture = jest.spyOn(posthogInstance, "capture");

  const baseReq: any = {
    get: jest.fn((key: string) =>
      key === "X-Ph-User-Distinct-Id" ? distinctId : sessionId
    ),
    bodyValidated: {
      category: "alimentation",
      expression: "alimentation",
    },
    nbResults: 5,
  };

  const generateTestCase = (
    lang: SupportedLanguagesCode,
    user: UserPopulateType
  ): [string, ExpressRequest, Partial<LogSearchPlaces>] => [
    `should log the consultation of ${trackedEvent} in ${lang} with ${user.status}`,
    {
      ...(lang === SupportedLanguagesCode.FR
        ? ORIGIN_SOLIGUIDE_REQUEST
        : ORIGIN_SOLINUM_ORG_REQUEST),
      user,
      bodyValidated: {
        category: "alimentation",
        expression: "alimentation",
      },
      nbResults: 5,
    } as unknown as ExpressRequest,
    {
      user: {
        email: user.mail,
        language: lang,
        orgaId: user.organizations[0]?.organization_id || null,
        orgaName: user.organizations[0]?.name || null,
        origin:
          lang === SupportedLanguagesCode.FR
            ? Origin.SOLIGUIDE
            : Origin.SOLINUM_ORG,
        referrer: null,
        role: null,
        status: user.status,
        territory: user.territories[0],
        userName: generateFullName(user.name, user.lastname),
        user_id: user.user_id,
      },
    },
  ];

  it.each([
    generateTestCase(SupportedLanguagesCode.FR, USER_PRO),
    generateTestCase(SupportedLanguagesCode.FR, USER_ADMIN_SOLIGUIDE),
  ])("%s", (_, userForLogs) => {
    const req = {
      ...baseReq,
      userForLogs: getUserForLogs(userForLogs),
    } as ExpressRequest;

    const properties = getSearchPropertiesFromRequest(req);

    trackSearchPlaces(req);

    expect(req.get).toHaveBeenNthCalledWith(1, "X-Ph-User-Distinct-Id");
    expect(req.get).toHaveNthReturnedWith(1, distinctId);
    expect(req.get).toHaveBeenNthCalledWith(2, "X-Ph-User-Session-Id");
    expect(req.get).toHaveNthReturnedWith(2, sessionId);
    expect(posthogCapture).toHaveBeenCalledTimes(1);
    expect(posthogCapture).toHaveBeenCalledWith({
      event: trackedEvent,
      req,
      properties,
    });
  });

  afterEach(() => jest.clearAllMocks());
});
