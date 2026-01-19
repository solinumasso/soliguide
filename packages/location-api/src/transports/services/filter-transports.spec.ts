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
import { StopPointMode } from "@soliguide/common";
import { filterTransports } from "./filter-transports";
import { mockHereTransportStations } from "../mocks/BUS_TRANSPORT_MOCK.const";

describe("filterTransports", () => {
  it("should remove stations with only excluded transports", () => {
    const result = filterTransports(mockHereTransportStations.onlyExcluded());
    expect(result.length).toBe(0);
  });

  it("should keep stations with at least one valid transport", () => {
    const result = filterTransports(mockHereTransportStations.mixedStation());

    expect(result.length).toBe(1);
    expect(result[0].place.name).toBe("Mixed Station");
    expect(result[0].transports[StopPointMode.BUS].length).toBe(1);
    expect(result[0].transports[StopPointMode.BUS][0].name).toBe("Bus 170");
  });

  it("should remove flixbus, blablacar and ouibus transports", () => {
    const result = filterTransports(mockHereTransportStations.allExcluded());
    const busNames = result[0].transports[StopPointMode.BUS].map((t) => t.name);

    expect(busNames).toEqual(["Bus 42"]);
  });

  it("should merge duplicate stations by name", () => {
    const result = filterTransports(
      mockHereTransportStations.duplicateStations()
    );

    expect(result.length).toBe(1);
    expect(result[0].place.name).toBe("Gare du Nord");
    expect(result[0].transports[StopPointMode.TRAIN].length).toBe(1);
    expect(result[0].transports[StopPointMode.SUBWAY].length).toBe(2);
  });

  it("should return an empty array when input is empty", () => {
    expect(filterTransports(mockHereTransportStations.empty())).toEqual([]);
  });
});
