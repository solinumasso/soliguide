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
  aggregateUsersForContacts,
  aggregateUsersForContactsEdition,
} from "./aggregateUserForContacts";
import { UserPopulateType, UserRightUserPopulate } from "../../_models";
import {
  UserRole,
  UserRightStatus,
  UserStatus,
  CountryCodes,
} from "@soliguide/common";
import {
  USER_ADMIN_SOLIGUIDE,
  USER_PRO_ROLES_POPULATED,
  USER_SIMPLE,
} from "../../../mocks";
import mongoose from "mongoose";

export const CONTACTS_FOR_ONE_PLACE: UserRightUserPopulate[] = [
  {
    _id: new mongoose.Types.ObjectId("6143bd55dc16136ff405f7fb"),
    displayContactPro: true,
    organization: new mongoose.Types.ObjectId(),
    organization_id: 3488,
    place: new mongoose.Types.ObjectId("6143bd55dc16136ff405f7fb"),
    place_id: 9930,
    role: UserRole.OWNER,
    status: UserRightStatus.VERIFIED,
    user: {
      _id: new mongoose.Types.ObjectId("e02a5c5f7acf59698383961f"),
      lastname: "Eriksen",
      mail: "paul@soliguide.dev",
      name: "Paul",
      status: UserStatus.PRO,
      user_id: 1,
      organizations: [],
      title: "",
      territories: [],
      verified: true,
      invitations: [],
      lastLogin: new Date("2021-10-01T12:26:33.760Z"),
      phone: {
        label: null,
        phoneNumber: "0606060606",
        countryCode: CountryCodes.FR,
        isSpecialPhoneNumber: false,
      },
    },
    user_id: 984,
  },
  {
    _id: new mongoose.Types.ObjectId("6156fe792380672f3b0a8dd5"),
    createdAt: new Date("2021-10-01T12:26:33.760Z"),
    displayContactPro: true,
    organization: new mongoose.Types.ObjectId("61162eec15b29bc0c080f14e"),
    organization_id: 883,
    place: new mongoose.Types.ObjectId(),
    place_id: 9930,
    role: UserRole.EDITOR,
    status: UserRightStatus.VERIFIED,
    updatedAt: new Date("2021-10-01T12:28:47.872Z"),
    user: {
      invitations: [],
      lastname: "Thiery",
      mail: "henry@soliguide.dev",
      name: "Henry",
      phone: {
        label: null,
        phoneNumber: "0606060606",
        countryCode: CountryCodes.FR,
        isSpecialPhoneNumber: false,
      },
      status: UserStatus.ADMIN_TERRITORY,
      user_id: 2,
      organizations: [],
      _id: new mongoose.Types.ObjectId("6143bd55dc16136ff405f7fb"),
      title: "",
      territories: [],
      verified: true,
    },
    user_id: 986,
  },
  {
    _id: new mongoose.Types.ObjectId("6156fe792380672f3b0a8dd5"),
    createdAt: new Date("2021-10-01T12:26:33.760Z"),
    displayContactPro: true,
    organization: new mongoose.Types.ObjectId("61162eec15b29bc0c080f14e"),
    organization_id: 883,
    place: new mongoose.Types.ObjectId("61162eec15b29bc0c080f14e"),
    place_id: 9930,
    role: UserRole.EDITOR,
    status: UserRightStatus.VERIFIED,
    updatedAt: new Date("2021-10-01T12:28:47.872Z"),
    user: {
      _id: new mongoose.Types.ObjectId("5fd78bb917e8c5648075c785"),
      lastname: "John",
      lastLogin: new Date("2021-10-01T12:26:33.760Z"),
      mail: "johndoe@soliguide.dev",
      name: "DOE",
      phone: {
        label: null,
        phoneNumber: "0606060606",
        countryCode: CountryCodes.FR,
        isSpecialPhoneNumber: false,
      },
      status: UserStatus.PRO,
      organizations: [],
      title: "",
      user_id: 3,
      territories: [],
      verified: true,
      invitations: [],
    },
    user_id: 985,
  },
];

describe("aggregateUserForContacts", () => {
  it("Should return null if there is no right", () => {
    expect(aggregateUsersForContacts([])).toStrictEqual([]);
  });

  it("Should return 2 contacts whithout 'edit' variables", () => {
    const result = aggregateUsersForContacts(CONTACTS_FOR_ONE_PLACE);

    expect(result).toHaveLength(3);
    expect(result).toEqual([
      {
        lastname: "Eriksen",
        mail: "paul@soliguide.dev",
        name: "Paul",
        phone: {
          label: null,
          phoneNumber: "0606060606",
          countryCode: CountryCodes.FR,
          isSpecialPhoneNumber: false,
        },
        title: "",
      },
      {
        lastname: "Thiery",
        mail: "henry@soliguide.dev",
        name: "Henry",
        phone: {
          label: null,
          phoneNumber: "0606060606",
          countryCode: CountryCodes.FR,
          isSpecialPhoneNumber: false,
        },
        title: "",
      },
      {
        lastname: "John",
        mail: "johndoe@soliguide.dev",
        name: "DOE",
        phone: {
          label: null,
          phoneNumber: "0606060606",
          countryCode: CountryCodes.FR,
          isSpecialPhoneNumber: false,
        },
        title: "",
      },
    ]);
  });
});

describe("[ADMIN] Display contact and 'canEdit' and 'canEditContact' variables", () => {
  it("Should return null if there is no right", () => {
    expect(
      aggregateUsersForContactsEdition([], USER_ADMIN_SOLIGUIDE)
    ).toStrictEqual([]);
  });
  it("ADMIN_SOLIGUIDE - Can edit everything", () => {
    const result = aggregateUsersForContactsEdition(
      CONTACTS_FOR_ONE_PLACE,
      USER_ADMIN_SOLIGUIDE
    );

    expect(result[0].canEdit).toEqual(true);
    expect(result[0].canEditUserInfos).toEqual(true);
    expect(result[1].canEdit).toEqual(true);
    expect(result[1].canEditUserInfos).toEqual(true);
    expect(result[2].canEdit).toEqual(true);
    expect(result[2].canEditUserInfos).toEqual(true);
  });

  it("PRO - Should return different results depend on other user's rights", () => {
    const result = aggregateUsersForContactsEdition(
      CONTACTS_FOR_ONE_PLACE,
      USER_PRO_ROLES_POPULATED
    );

    expect(result.length).toEqual(3);

    // 1. Same organization : can edit display and informations
    expect(result[0].userObjectId).toEqual("e02a5c5f7acf59698383961f");
    expect(result[0].canEdit).toEqual(true);
    expect(result[0].canEditUserInfos).toEqual(true);
    // 2. Not the same organization, but can edit place : edit only display informations
    expect(result[1].userObjectId).toEqual("5fd78bb917e8c5648075c785");
    expect(result[1].canEdit).toEqual(true);
    expect(result[1].canEditUserInfos).toEqual(false);
    // 3. User is a pro, and contact is an "ADMIN_TERRIRORY" : can't edit anything
    expect(result[2].userObjectId).toEqual("6143bd55dc16136ff405f7fb");
    expect(result[2].canEdit).toEqual(false);
    expect(result[2].canEditUserInfos).toEqual(false);
  });
  it("SIMPLE_USER - nothing is editable", () => {
    const result = aggregateUsersForContactsEdition(
      CONTACTS_FOR_ONE_PLACE,
      USER_SIMPLE as any as UserPopulateType
    );

    expect(result.length).toEqual(3);
    expect(result[0].canEdit).toEqual(false);
    expect(result[0].canEditUserInfos).toEqual(false);
    expect(result[1].canEdit).toEqual(false);
    expect(result[1].canEditUserInfos).toEqual(false);
    expect(result[2].canEdit).toEqual(false);
    expect(result[2].canEditUserInfos).toEqual(false);
  });
});
