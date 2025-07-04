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
import { SupportedLanguagesCode, TempInfoType } from "@soliguide/common";
import { translator } from "../../../../config";
import { parseTempInfo } from "../parse-temp-info";
import { TEMP_INFO_MOCK } from "./TEMP_INFO.mock";
import { UpComingTempInfo } from "../../../types";

describe("parseTempInfo", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2022-10-01T01:00:00.000Z"));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return a sentence with the 3 upcoming closures in english", () => {
    const upComingTempInfo: UpComingTempInfo = TEMP_INFO_MOCK.filter(
      (value) => value.placeId === 33268
    );

    const result = parseTempInfo(
      translator,
      SupportedLanguagesCode.EN,
      upComingTempInfo[0].tempInfo,
      TempInfoType.CLOSURE
    );

    expect(result).toEqual(
      "Temporary closure: from 15/06/2023 to 30/06/2023\nFirst closure for works\n\nTemporary closure: from 02/07/2023 to 11/07/2023\nSecond closure following a strike\n\nTemporary closure: from 14/07/2023 to 14/07/2023\nThird closing for July 14, public holiday"
    );
  });
});
