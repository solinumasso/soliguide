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

import { createUserRights } from "../createUserRights";
import mongoose from "mongoose";
import { UserRightStatus, UserRole } from "@soliguide/common";
import { USER_PRO, ORGANIZATION, ONLINE_PLACE } from "../../../../mocks";
import { OrganizationPopulate } from "../../../_models";

const organization: Pick<OrganizationPopulate, "_id" | "organization_id"> = {
  _id: new mongoose.Types.ObjectId(ORGANIZATION._id) as any,
  organization_id: ORGANIZATION.organization_id,
};

describe("createUserRights", () => {
  it("Create a user right by default: READER:", () => {
    expect(
      createUserRights(USER_PRO, organization, [ONLINE_PLACE])
    ).toStrictEqual([
      {
        displayContactPro: false,
        organization: new mongoose.Types.ObjectId("5fb648823cb90874d9ab1bef"),
        organization_id: 2316,
        place: "5a58c0c7c1797fe45e3772ab",
        place_id: 33,
        role: "READER",
        status: UserRightStatus.VERIFIED,
        user: new mongoose.Types.ObjectId("5fd78bb917e8c5648075c785"),
        user_id: 451,
      },
      {
        displayContactPro: false,
        organization: new mongoose.Types.ObjectId("5fb648823cb90874d9ab1bef"),
        organization_id: 2316,
        place: null,
        place_id: null,
        role: "READER",
        status: UserRightStatus.VERIFIED,
        user: new mongoose.Types.ObjectId("5fd78bb917e8c5648075c785"),
        user_id: 451,
      },
    ]);
  });

  it("Create an OWNER:", () => {
    expect(
      createUserRights(USER_PRO, organization, [ONLINE_PLACE], UserRole.OWNER)
    ).toStrictEqual([
      {
        displayContactPro: false,
        organization: new mongoose.Types.ObjectId("5fb648823cb90874d9ab1bef"),
        organization_id: 2316,
        place: "5a58c0c7c1797fe45e3772ab",
        place_id: 33,
        role: UserRole.OWNER,
        status: UserRightStatus.VERIFIED,
        user: new mongoose.Types.ObjectId("5fd78bb917e8c5648075c785"),
        user_id: 451,
      },
      {
        displayContactPro: false,
        organization: new mongoose.Types.ObjectId("5fb648823cb90874d9ab1bef"),
        organization_id: 2316,
        place: null,
        place_id: null,
        role: UserRole.OWNER,
        status: UserRightStatus.VERIFIED,
        user: new mongoose.Types.ObjectId("5fd78bb917e8c5648075c785"),
        user_id: 451,
      },
    ]);
  });

  it("Create a user right for an invitation with an OWNER:", () => {
    expect(
      createUserRights(
        USER_PRO,
        organization,
        [ONLINE_PLACE],
        UserRole.OWNER,
        true
      )
    ).toStrictEqual([
      {
        displayContactPro: false,
        organization: new mongoose.Types.ObjectId("5fb648823cb90874d9ab1bef"),
        organization_id: 2316,
        place: "5a58c0c7c1797fe45e3772ab",
        place_id: 33,
        role: UserRole.OWNER,
        status: "PENDING",
        user: new mongoose.Types.ObjectId("5fd78bb917e8c5648075c785"),
        user_id: 451,
      },
      {
        displayContactPro: false,
        organization: new mongoose.Types.ObjectId("5fb648823cb90874d9ab1bef"),
        organization_id: 2316,
        place: null,
        place_id: null,
        role: UserRole.OWNER,
        status: "PENDING",
        user: new mongoose.Types.ObjectId("5fd78bb917e8c5648075c785"),
        user_id: 451,
      },
    ]);
  });

  it("Create a user right for an invitation with an OWNER without places:", () => {
    expect(
      createUserRights(USER_PRO, organization, [], UserRole.OWNER, true)
    ).toStrictEqual([
      {
        displayContactPro: false,
        organization: new mongoose.Types.ObjectId("5fb648823cb90874d9ab1bef"),
        organization_id: 2316,
        place: null,
        place_id: null,
        role: UserRole.OWNER,
        status: "PENDING",
        user: new mongoose.Types.ObjectId("5fd78bb917e8c5648075c785"),
        user_id: 451,
      },
    ]);
  });

  it("Create a user right with an OWNER without places:", () => {
    expect(
      createUserRights(USER_PRO, organization, [], UserRole.OWNER)
    ).toStrictEqual([
      {
        displayContactPro: false,
        organization: new mongoose.Types.ObjectId("5fb648823cb90874d9ab1bef"),
        organization_id: 2316,
        place: null,
        place_id: null,
        role: UserRole.OWNER,
        status: UserRightStatus.VERIFIED,
        user: new mongoose.Types.ObjectId("5fd78bb917e8c5648075c785"),
        user_id: 451,
      },
    ]);
  });
});
