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
  createUser,
  updateUser,
  getUserByParams,
  isUserInOrganization,
} from "../services";

import type { OrganizationPopulate } from "../../_models";

import { buildUserAreas } from "../utils";
import { SoliguideCountries, UserStatus } from "@soliguide/common";
import { SignupUser, User, UserPopulateType } from "../interfaces";

export const signupWithoutInvitation = async (
  userData: SignupUser
): Promise<UserPopulateType | null> => {
  const user: SignupUser & Pick<User, "verified" | "verifiedAt" | "areas"> = {
    ...userData,
    verified: true,
    verifiedAt: new Date(),
  };

  const { territories, areas } = buildUserAreas(user, userData);

  return await createUser({ ...user, territories, areas });
};

export const patchUserAccount = async (
  userObjectId: string | number | mongoose.Types.ObjectId,
  userData: Partial<User>
): Promise<UserPopulateType | null> => {
  return await updateUser({ _id: userObjectId }, userData);
};

export const getUserByEmail = async (
  mail: string
): Promise<UserPopulateType | null> => {
  return await getUserByParams({
    mail,
  });
};

export const isUserInOrga = async (
  mail: string,
  organization: OrganizationPopulate
): Promise<boolean> => {
  const user = await getUserByParams({
    mail,
  });

  return user ? await isUserInOrganization(user._id, organization._id) : false;
};
