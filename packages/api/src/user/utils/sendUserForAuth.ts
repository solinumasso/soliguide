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
import { aggregateUserRightsForAuth } from "./aggregateUserRightsForAuth";

import { UserPopulateType } from "../../_models";

import { ApiOrganization, UserForAuth } from "@soliguide/common";

export const sendUserForAuth = (user: UserPopulateType): UserForAuth => {
  const { places, role } = aggregateUserRightsForAuth(user);
  const organizations: Array<
    Pick<ApiOrganization, "_id" | "organization_id" | "name">
  > = [];

  user.organizations.forEach((organization: ApiOrganization) => {
    organizations.push({
      _id: organization._id,
      name: organization.name,
      organization_id: organization.organization_id,
    });
  });

  return {
    _id: user._id.toString(),
    categoriesLimitations: user.categoriesLimitations,
    devToken: user.devToken,
    languages: user.languages,
    lastname: user.lastname,
    mail: user.mail,
    name: user.name,
    organizations,
    phone: user.phone,
    places,
    role,
    selectedOrgaIndex: user.selectedOrgaIndex,
    status: user.status,
    title: user.title,
    translator: user.translator,
    user_id: user.user_id,
    verified: user.verified,
    areas: user?.areas,
    lastLogin: user?.lastLogin,
  };
};
