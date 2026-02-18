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

import { PopulatedUser } from "../../_models";

export const ARRAY_OF_USERS_FIELDS_TO_POPULATE: Array<keyof PopulatedUser> = [
  "_id",
  "areas",
  "invitations",
  "lastname",
  "lastLogin",
  "mail",
  "name",
  "organizations",
  "phone",
  "status",
  "territories",
  "title",
  "user_id",
  "verified",
];

export const USERS_FIELDS_FOR_POPULATE: string =
  ARRAY_OF_USERS_FIELDS_TO_POPULATE.join(" ");

export const PLACE_FIELDS_FOR_USERS =
  "_id campaigns close createdAt entity lieu_id name parcours placeType position priority visibility seo_url services_all status verified updatedAt updatedByUserAt";

// Defaults joins for users : organizations, invitations
export const DEFAULT_USER_POPULATE = [
  "invitations",
  {
    path: "invitations",
    populate: { path: "organization" },
  },
  "organizations",
];
