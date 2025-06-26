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
import { ONLINE_PLACE_MOCK } from "./ONLINE_PLACE.mock";

import { Organisation } from "../src/app/modules/admin-organisation/interfaces/organisation.interface";

import { OrgaCampaignStatus } from "../src/app/models/campaign/types/CampaignStatus.type";

export const ORGANIZATION_MOCK: Organisation = new Organisation({
  _id: "5fb648823cb90874d9ab1bef",
  campaigns: {
    runningCampaign: {
      autonomyRate: 0,
      endDate: null,
      startDate: null,
      status: OrgaCampaignStatus.TO_DO,
      toUpdate: true,
    },
  },
  createdAt: new Date("2020-11-19T08:59:48.182Z"),
  description: "Ceci est une belle orga de test",
  facebook: "",
  fax: "",
  invitations: [],
  logo: null,
  mail: "mon-orga@orga.fr",
  name: "Organisme de test",
  organization_id: 2316,
  phone: null,
  places: [ONLINE_PLACE_MOCK],
  priority: false,
  relations: [],
  territories: ["75"],
  updatedAt: new Date("2021-06-10T09:54:21.104Z"),
  users: [],
  verified: {
    date: new Date("2020-12-07T14:48:25.000Z"),
    status: true,
  },
  website: "http://test.orga.fr",
});
