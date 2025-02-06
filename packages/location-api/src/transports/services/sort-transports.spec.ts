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
import { Station, StopPointMode } from "@soliguide/common";
import { FRENCH_STOP_POINT_MOCK } from "../mocks/FRENCH_STOP_POINT_MOCK.const";
import { sortTransports } from "./sort-transports";
import { HereTransportStation } from "../interfaces/here-station.interface";

describe("sortTransports", () => {
  let sortedStations: Station[];

  beforeEach(() => {
    sortedStations = sortTransports(FRENCH_STOP_POINT_MOCK.stations);
  });

  it("should correctly group stations by name", () => {
    expect(sortedStations.length).toBe(3);
    const stationNames = sortedStations.map((station) => station.place.name);
    expect(stationNames).toEqual(
      expect.arrayContaining([
        "Porte de Paris",
        "Porte de Paris - Stade de France",
        "Saint-Denis - Porte de Paris",
      ])
    );
  });

  it("should group transports by mode for each station", () => {
    sortedStations.forEach((station) => {
      expect(station).toHaveProperty("transports");
      Object.values(station.transports).forEach((transportGroup) => {
        expect(Array.isArray(transportGroup)).toBe(true);
      });
    });
  });

  it("should remove duplicate transports within each mode", () => {
    const porteDeParisStation = sortedStations.find(
      (s) => s.place.name === "Porte de Paris"
    );

    expect(porteDeParisStation).toBeDefined();
    if (porteDeParisStation) {
      expect(porteDeParisStation.transports[StopPointMode.BUS].length).toBe(4);
      const busNames = porteDeParisStation.transports[StopPointMode.BUS].map(
        (t) => t.name
      );
      expect(new Set(busNames).size).toBe(busNames.length);
    }
  });

  it("should correctly handle stations with multiple transport modes", () => {
    const saintDenisStation = sortedStations.find(
      (s) => s.place.name === "Saint-Denis - Porte de Paris"
    );
    expect(saintDenisStation).toBeDefined();
    if (saintDenisStation) {
      expect(saintDenisStation.transports).toHaveProperty(StopPointMode.SUBWAY);
      expect(saintDenisStation.transports).toHaveProperty(
        StopPointMode.TRAMWAY
      );

      // 2 terminus for a same subway -> we keep only 1
      expect(saintDenisStation.transports[StopPointMode.SUBWAY].length).toBe(1);

      // 2 terminus for a same lightRail -> we keep only 1
      expect(saintDenisStation.transports[StopPointMode.TRAMWAY].length).toBe(
        1
      );
    }
  });
});

describe("sortTransports edge cases", () => {
  it("should handle empty input correctly", () => {
    const result = sortTransports([]);
    expect(result).toEqual([]);
  });

  it("should handle stations with no transports", () => {
    const emptyStation: HereTransportStation = {
      place: {
        name: "Empty Station",
        type: "station",
        location: { lat: 0, lng: 0 },
        id: "empty",
      },
      transports: [],
    };
    const result = sortTransports([emptyStation]);
    expect(result.length).toBe(0);
  });
});
