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
import {
  CampaignSource,
  PlaceChangesSection,
  PlaceChangesStatus,
  SupportedLanguagesCode,
  UserRole,
} from "@soliguide/common";

import { ONLINE_PLACE_MOCK } from "./ONLINE_PLACE.mock";
import { USER_PRO_MOCK } from "./USER_PRO.mock";

import { PlaceChanges } from "../src/app/models/place-changes";
import { generateCompleteName } from "../src/app/shared/functions";

export const PLACE_CHANGES_MOCK: PlaceChanges = new PlaceChanges({
  _id: "5fb61d3a3cb90874d9ab12e2",
  campaignName: null,
  createdAt: new Date("2022-02-18T17:35:05"),
  isCampaign: false,
  lieu_id: 1,
  new: ONLINE_PLACE_MOCK,
  noChanges: false,
  old: ONLINE_PLACE_MOCK,
  section: PlaceChangesSection.status,
  source: CampaignSource.CALL,
  place: ONLINE_PLACE_MOCK,
  status: PlaceChangesStatus.NOT_EVALUATED,
  updatedAt: new Date("2022-03-18T11:02:16"),
  userData: {
    orgaId: USER_PRO_MOCK.organizations[0].organization_id,
    orgaName: USER_PRO_MOCK.organizations[0].name,
    email: USER_PRO_MOCK.mail,
    status: USER_PRO_MOCK.status,
    territory: USER_PRO_MOCK.areas.fr.departments[0],
    userName: generateCompleteName(USER_PRO_MOCK.name, USER_PRO_MOCK.lastname),
    language: SupportedLanguagesCode.FR,
    role: UserRole.EDITOR,
    referrer: null,
    user_id: USER_PRO_MOCK.user_id,
  },
  territory: "93",
  userName: generateCompleteName(USER_PRO_MOCK.name, USER_PRO_MOCK.lastname),
});
