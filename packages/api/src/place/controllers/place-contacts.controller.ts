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
import { ModelWithId } from "../../_models";
import { UserPopulateType, UserRight } from "../../user/interfaces";
import {
  getContactsFromUserRights,
  updateUserRightsWithParams,
} from "../../user/services";
import {
  aggregateUsersForContacts,
  aggregateUsersForContactsEdition,
} from "../utils";
import {
  ApiPlace,
  PlaceContact,
  PlaceContactForAdmin,
} from "@soliguide/common";

export const getContactsProForPlace = async (
  place: ModelWithId<ApiPlace>
): Promise<PlaceContact[]> => {
  const rights = await getContactsFromUserRights(place._id, true);

  return aggregateUsersForContacts(rights);
};

export const getContactsProForPlaceAdmin = async (
  place: ModelWithId<ApiPlace>,
  user: UserPopulateType
): Promise<PlaceContactForAdmin[]> => {
  const rights = await getContactsFromUserRights(place._id);
  return aggregateUsersForContactsEdition(rights, user);
};

export const patchDisplayContactPro = async (
  userRight: Pick<UserRight, "_id">,
  newValue: Pick<UserRight, "displayContactPro">
): Promise<void> => {
  await updateUserRightsWithParams(
    {
      _id: userRight._id,
    },
    newValue
  );
};
