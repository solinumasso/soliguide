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
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { LocationAutoCompleteAddress } from "../../../location";
import { PublicHoliday } from "../../interfaces";
import { filterDepartmentsForHolidays } from "../filterDepartmentsForHolidays";

describe("filterDepartmentsForHolidays", () => {
  const sampleHolidays: PublicHoliday[] = [
    {
      isNational: true,
      name: "Noël",
      departments: [],
      startDate: "2024-12-25",
      endDate: "2024-12-25",
      translations: { en: "Christmas Day" },
    },
    {
      isNational: false,
      name: "Abolition de l'esclavage",
      departments: ["974"],
      startDate: "2024-12-20",
      endDate: "2024-12-20",
      translations: { en: "Abolition of slavery" },
    },
    {
      isNational: false,
      name: "2ème jour de Noël",
      departments: ["57", "67", "68"],
      startDate: "2024-12-26",
      endDate: "2024-12-26",
      translations: { en: "2nd day of Christmas" },
    },
  ];

  it("should filter holidays for Alsace department", () => {
    const location = {
      departmentCode: "67",
      city: "Strasbourg",
      postalCode: "67000",
    } as LocationAutoCompleteAddress;

    const result = filterDepartmentsForHolidays({
      holidays: sampleHolidays,
      location,
    });

    expect(result).toHaveLength(2);
    expect(result).toContainEqual(sampleHolidays[0]);
    expect(result).toContainEqual(sampleHolidays[2]);
  });

  it("should return only national holidays when no place or location provided", () => {
    const result = filterDepartmentsForHolidays({
      holidays: sampleHolidays,
    });

    expect(result).toHaveLength(1);
    expect(result).toContainEqual(sampleHolidays[0]);
  });

  it("should return empty array when holidays array is empty", () => {
    const location = {
      departmentCode: "67",
      city: "Strasbourg",
    } as unknown as LocationAutoCompleteAddress;

    const result = filterDepartmentsForHolidays({
      holidays: [],
      location,
    });

    expect(result).toHaveLength(0);
  });

  // Test avec plusieurs départements
  it("should correctly filter holidays for multiple departments", () => {
    const holidays = [
      ...sampleHolidays,
      {
        isNational: false,
        name: "Jour férié spécial",
        departments: ["67", "974"],
        startDate: "2024-12-27",
        endDate: "2024-12-27",
        translations: { en: "Special Holiday" },
      },
    ];

    const location = {
      departmentCode: "67",
      city: "Strasbourg",
    } as LocationAutoCompleteAddress;

    const result = filterDepartmentsForHolidays({
      holidays,
      location,
    });

    expect(result).toHaveLength(3);
    expect(result).toContainEqual(holidays[0]);
    expect(result).toContainEqual(holidays[2]);
    expect(result).toContainEqual(holidays[3]);
  });
});
