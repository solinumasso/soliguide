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
import mongoose from "mongoose";
import {
  CountryAreaTerritories,
  CountryCodes,
  UserStatus,
  UserTypeLogged,
} from "@soliguide/common";
import { ABSTRACT_USER } from "./ABSTRACT_USER.mock";
import { UserPopulateType } from "../../src/_models";

const areas = {
  fr: new CountryAreaTerritories<CountryCodes.FR>({
    departments: ["93"],
  }),
};

export const USER_ADMIN_TERRITORY: UserPopulateType = {
  ...ABSTRACT_USER,
  ...{
    areas,
    _id: new mongoose.Types.ObjectId(345),
    createdAt: new Date("2019-07-28T21:07:28.007Z"),
    lastname: "Team SSD",
    mail: "mon-territoire@soliguide.fr",
    name: "Prénom SSD",
    password: "xxxxxx",
    passwordToken: "xxxxxxx",
    phone: {
      label: null,
      isSpecialPhoneNumber: false,
      countryCode: CountryCodes.FR,
      phoneNumber: "0667434205",
    },
    status: UserStatus.ADMIN_TERRITORY,
    territories: ["93"],
    places: [],
    userRights: [],
    organizations: [],
    invitations: [],
    title: "Gérant autonome de la seine-saint-denis",
    updatedAt: new Date("2021-04-29T08:20:04.247Z"),
    user_id: 345,
    lastLogin: new Date("2025-04-29T08:20:04.247Z"),
    type: UserTypeLogged.LOGGED,
    isLogged() {
      return true;
    },
  },
};
