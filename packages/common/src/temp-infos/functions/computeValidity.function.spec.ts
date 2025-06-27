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
import { TempInfoStatus } from "../enums";
import { computeValidity } from "./computeValidity.function";
import { addDays } from "date-fns";

describe("Information validity and temporary messages", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2021-04-23T00:00:00.000Z"));
  });

  const startDateActive = new Date("2021-03-22T00:00:00.000Z");
  const endDateActive = new Date("2021-05-22T00:00:00.000Z");

  const sixteenDaysBefore = new Date("2021-03-06T00:00:00.000Z");

  it("Inactive validity: no color", () => {
    const tmpNow = computeValidity(null, null);
    expect(tmpNow).toBeTruthy();
    expect(tmpNow.infoColor).toEqual("");
    expect(tmpNow.status).toBeFalsy();
  });

  it("Active validity: danger color", () => {
    const tmpNow = computeValidity(startDateActive, endDateActive);
    expect(tmpNow).toBeTruthy();
    expect(tmpNow.infoColor).toEqual("danger");
  });

  it("Active validity: 10 days before, warning color", () => {
    const tmpNow = computeValidity(addDays(new Date(), 10), endDateActive);
    expect(tmpNow).toBeTruthy();
    expect(tmpNow.infoColor).toEqual("warning");
    expect(tmpNow.status).toEqual(TempInfoStatus.INCOMING);
  });

  it("Active validity: 16 days before, not active", () => {
    jest.setSystemTime(sixteenDaysBefore);
    const tmpNow = computeValidity(addDays(new Date(), 16), endDateActive);
    expect(tmpNow).toBeTruthy();
    expect(tmpNow.active).toBeFalsy();
    expect(tmpNow.status).toEqual(TempInfoStatus.FUTURE);
  });

  it("Not active validity: dates not yet started", () => {
    jest.setSystemTime(new Date("2021-04-23T00:00:00.000Z"));
    const startDateInactive = new Date("2021-05-12T00:00:00.000Z");
    const endDateInactive = new Date("2021-06-22T00:00:00.000Z");

    const tmp = computeValidity(startDateInactive, endDateInactive);
    expect(tmp).toBeTruthy();
    expect(tmp.active).toBeFalsy();
    expect(tmp.status).toEqual(TempInfoStatus.FUTURE);
  });

  it("Not active validity: expired dates", () => {
    jest.setSystemTime(new Date("2021-04-23T00:00:00.000Z"));
    const startDateInactive = new Date("2021-03-12T00:00:00.000Z");
    const endDateInactive = new Date("2021-04-22T00:00:00.000Z");

    const tmp = computeValidity(startDateInactive, endDateInactive);
    expect(tmp).toBeTruthy();
    expect(tmp.active).toBeFalsy();
    expect(tmp.status).toEqual(TempInfoStatus.OBSOLETE);
  });
});
