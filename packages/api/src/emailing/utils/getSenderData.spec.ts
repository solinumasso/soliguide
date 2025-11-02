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
import { getSenderData } from "./getSenderData";

describe("getSenderData", () => {
  // Test for null territory which should return default values
  test("returns default values when territory is null", () => {
    expect(getSenderData(null, "senderEmail")).toBe("contact@solinum.org");
    expect(getSenderData(null, "senderFirstName")).toBe("L'équipe Soliguide");
    expect(getSenderData(null, "senderName")).toBe("Soliguide France");
  });

  // Test for valid territory code
  test("returns correct values for a valid territory", () => {
    expect(getSenderData("01", "senderEmail")).toBe("aura@solinum.org");
    expect(getSenderData("01", "senderFirstName")).toBe(
      "L'équipe Soliguide Ain"
    );
    expect(getSenderData("01", "senderName")).toBe("Solinum Ain");
  });

  // Test for a territory code that does not exist
  test("returns default values for a non-existent territory", () => {
    expect(getSenderData("99" as any, "senderEmail")).toBe(
      "contact@solinum.org"
    );
    expect(getSenderData("99" as any, "senderFirstName")).toBe(
      "L'équipe Soliguide"
    );
    expect(getSenderData("99" as any, "senderName")).toBe("Soliguide France");
  });

  // Edge cases for incorrect key inputs
  test("handles incorrect key inputs gracefully", () => {
    const invalidKey = "unknownKey";
    const castedInvalidKey = invalidKey as
      | "senderEmail"
      | "senderFirstName"
      | "senderName";
    expect(getSenderData(null, castedInvalidKey)).toBeUndefined();
  });
});
