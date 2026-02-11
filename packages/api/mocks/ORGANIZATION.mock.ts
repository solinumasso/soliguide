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
  ApiOrganization,
  CountryAreaTerritories,
  CountryCodes,
} from "@soliguide/common";

export const ORGANIZATION: ApiOrganization = {
  roles: [],
  _id: "5fb648823cb90874d9ab1bef",
  counters: {
    invitations: {
      EDITOR: 0,
      OWNER: 0,
      READER: 0,
      TOTAL: 0,
    },
    users: {
      EDITOR: 0,
      OWNER: 1,
      READER: 0,
      TOTAL: 1,
    },
  },
  createdAt: new Date("2020-11-19T08:59:48.182Z"),
  description: "Ceci est une belle orga de test",
  facebook: "",
  fax: "",
  invitations: [],
  lastLogin: null,
  logo: "",
  mail: "mon-orga@orga.fr",
  name: "Organisme de test",
  organization_id: 2316,
  phone: null,
  places: [
    "5f3e410671da5d1689abb9ea",
    "5de7991b878c7f1ba9db5876",
    "5a58c0c7c1797fe45e3773de",
    "5a58c0c7c1797fe45e37728b",
  ],
  priority: false,
  relations: ["ASSOCIATION"],
  // @deprecated
  territories: ["75"],
  areas: {
    fr: new CountryAreaTerritories<CountryCodes.FR>({
      departments: ["75"],
    }),
  },
  updatedAt: new Date("2021-06-10T09:54:21.104Z"),
  users: ["5fce40b957e7cc6a57f6db5b"],
  verified: {
    date: new Date("2020-12-07T14:48:25.000Z"),
    status: true,
  },
  website: "http://test.orga.fr",
};
