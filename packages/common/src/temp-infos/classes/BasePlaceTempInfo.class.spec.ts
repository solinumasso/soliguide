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
import { BasePlaceTempInfo } from "..";
import { addDays, subDays } from "date-fns";

describe("BasePlaceTempInfo", () => {
  // Reference date for tests: May 9, 2025
  const NOW = new Date("2025-05-09T12:00:00.000Z");

  beforeEach(() => {
    // Mock current date for all tests
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe("infoColor property", () => {
    test("should be null when no dates are provided", () => {
      const tempInfo = new BasePlaceTempInfo();
      expect(tempInfo.infoColor).toBe("");
    });

    test("should be null when only actif is true but no dates", () => {
      const tempInfo = new BasePlaceTempInfo({
        actif: true,
      });
      expect(tempInfo.infoColor).toBe("");
    });

    test('should be "warning" when startDate is in less than 15 days from now', () => {
      // Start date in 10 days (May 19, 2025)
      const startDate = addDays(NOW, 10);
      // End date in 20 days (May 29, 2025)
      const endDate = addDays(NOW, 20);

      const tempInfo = new BasePlaceTempInfo({
        actif: true,
        dateDebut: startDate,
        dateFin: endDate,
      });

      expect(tempInfo.infoColor).toBe("warning");
    });

    test('should be "warning" when startDate is exactly 15 days from now', () => {
      // Start date exactly 15 days from now (May 24, 2025)
      const startDate = addDays(NOW, 15);
      // End date in 30 days
      const endDate = addDays(NOW, 30);

      const tempInfo = new BasePlaceTempInfo({
        actif: true,
        dateDebut: startDate,
        dateFin: endDate,
      });

      expect(tempInfo.infoColor).toBe("warning");
    });

    test('should be "danger" when startDate is today', () => {
      // Start date is today (May 9, 2025)
      const startDate = new Date(NOW);
      // End date in 10 days
      const endDate = addDays(NOW, 10);

      const tempInfo = new BasePlaceTempInfo({
        actif: true,
        dateDebut: startDate,
        dateFin: endDate,
      });

      expect(tempInfo.infoColor).toBe("danger");
    });

    test('should be "danger" when startDate is in the past but endDate is in the future', () => {
      // Start date 5 days ago (May 4, 2025)
      const startDate = subDays(NOW, 5);
      // End date in 5 days (May 14, 2025)
      const endDate = addDays(NOW, 5);

      const tempInfo = new BasePlaceTempInfo({
        actif: true,
        dateDebut: startDate,
        dateFin: endDate,
      });

      expect(tempInfo.infoColor).toBe("danger");
    });

    test('should be "danger" when startDate is in the past and no endDate is provided', () => {
      // Start date 5 days ago (May 4, 2025)
      const startDate = subDays(NOW, 5);

      const tempInfo = new BasePlaceTempInfo({
        actif: true,
        dateDebut: startDate,
        dateFin: null,
      });

      expect(tempInfo.infoColor).toBe("danger");
    });

    test("should have infoColor null when startDate is more than 15 days in the future", () => {
      // Start date in 20 days (May 29, 2025)
      const startDate = addDays(NOW, 20);
      // End date in 30 days
      const endDate = addDays(NOW, 30);

      const tempInfo = new BasePlaceTempInfo({
        actif: true,
        dateDebut: startDate,
        dateFin: endDate,
      });

      expect(tempInfo.infoColor).toBe("");
    });

    test("should have infoColor null when both dates are in the past", () => {
      // Start date 20 days ago
      const startDate = subDays(NOW, 20);
      // End date 5 days ago
      const endDate = subDays(NOW, 5);

      const tempInfo = new BasePlaceTempInfo({
        actif: true,
        dateDebut: startDate,
        dateFin: endDate,
      });

      expect(tempInfo.infoColor).toBe("");
    });

    test("should handle real-world data example correctly", () => {
      const data = {
        closure: {
          actif: true,
          dateDebut: new Date("2025-05-08T00:00:00.000Z"), // Yesterday relative to NOW
          dateFin: new Date("2025-05-22T23:59:59.000Z"), // About 13 days in the future
          description: "<p>blablalbalb</p>",
        },
        hours: {
          actif: false,
          dateDebut: null,
          dateFin: null,
          description: null,
          hours: null,
        },
        message: {
          actif: false,
          dateDebut: null,
          dateFin: null,
          description: null,
          name: null,
        },
      };

      const tempInfo = new BasePlaceTempInfo(data.closure);

      // Start date is in the past (yesterday) and end date is in the future
      // so we expect "danger"
      expect(tempInfo.infoColor).toBe("danger");
    });
  });
});
