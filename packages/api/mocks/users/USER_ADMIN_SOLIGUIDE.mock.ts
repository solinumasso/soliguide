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

import { CountryCodes, UserStatus, UserTypeLogged } from "@soliguide/common";
import { ABSTRACT_USER } from "./ABSTRACT_USER.mock";
import { UserPopulateType } from "../../src/_models";

export const USER_ADMIN_SOLIGUIDE: UserPopulateType = {
  ...ABSTRACT_USER,
  ...{
    _id: new mongoose.Types.ObjectId(123),
    createdAt: new Date("2019-07-28T21:07:28.007Z"),
    lastname: "NOM_SOLIGUIDE_ADMIN",
    mail: "USER@solinum.org",
    name: "PRENOM_SOLIGUIDE_ADMIN",
    password: "xoksopkwpoxkswpokxopwskopxswSC",
    passwordToken: "$ccccccccccG",
    phone: {
      label: null,
      phoneNumber: "0667434205",
      countryCode: CountryCodes.FR,
      isSpecialPhoneNumber: false,
    },
    status: UserStatus.ADMIN_SOLIGUIDE,
    territories: ["75"],
    places: [],
    userRights: [],
    organizations: [],
    invitations: [],
    title: "Chips",
    updatedAt: new Date("2021-04-29T08:20:04.247Z"),
    user_id: 123,
    verified: true,
    lastLogin: new Date("2025-07-28T21:07:28.007Z"),
    type: UserTypeLogged.LOGGED,
    isLogged() {
      return true;
    },
  },
};
