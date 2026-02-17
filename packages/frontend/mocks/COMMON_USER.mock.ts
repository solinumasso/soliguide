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
import { UserStatus, CountryCodes, CommonUser } from "@soliguide/common";
import { Organisation } from "../src/app/modules/admin-organisation/interfaces/organisation.interface";

export const COMMON_USER_PRO: CommonUser = {
  createdAt: new Date(),
  updatedAt: new Date(),
  verifiedAt: new Date(),
  lastLogin: new Date(),
  invitations: [],
  blocked: false,
  password: "xx",
  _id: "5fd78bb917e8c5648075c785",
  categoriesLimitations: [],
  devToken: null,
  languages: [],
  lastname: "Nom-pro",
  mail: "mail-user-pro@structure.fr",
  name: "Marcel",
  organizations: [
    new Organisation({
      _id: "5fb648823cb90874d9ab1bef",
      organization_id: 2316,
    }),
  ],
  phone: {
    countryCode: CountryCodes.FR,
    label: null,
    isSpecialPhoneNumber: false,
    phoneNumber: "0667434205",
  },
  selectedOrgaIndex: 0,
  status: UserStatus.PRO,
  title: "Président de la structure",
  translator: false,
  user_id: 451,
  verified: true,
  territories: ["67"],
};
