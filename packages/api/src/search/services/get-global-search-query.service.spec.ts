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

import { User } from "../../user/interfaces";
import { getGlobalSearchQuery } from "./get-global-search-query.service";

describe("getGlobalSearchQuery", () => {
  it("Should return object with placeId and mail", () => {
    const test = getGlobalSearchQuery(
      {
        xxx: 1,
        lieu_id: 19,
        mail: "aa@aa.fr",
      },
      ["lieu_id", "mail"],
      {} as User
    );

    expect(test).toEqual({
      lieu_id: 19,
      mail: {
        $options: "i",
        $regex: /.*aa@aa\.fr.*/,
      },
    });
  });

  it("Should return object without mail because it's empty", () => {
    const test = getGlobalSearchQuery(
      {
        xxx: 1,
        lieu_id: 19,
        mail: "",
      },
      ["lieu_id", "mail"],
      {} as User
    );

    expect(test).toEqual({ lieu_id: 19 });
  });

  it("Should return object without mail because it's empty", () => {
    const test = getGlobalSearchQuery(
      {
        object: { key: "value" },
        lieu_id: 19,
        mail: "",
      },
      ["lieu_id", "mail", "object"],
      {} as User
    );

    expect(test).toEqual({ lieu_id: 19, object: { key: "value" } });
  });

  it("Should return object without null values", () => {
    const test = getGlobalSearchQuery(
      {
        xxx: null,
        lieu_id: null,
        mail: "",
      },
      ["lieu_id", "mail", "xxx"],
      {} as User
    );

    expect(test).toEqual({});
  });
});
