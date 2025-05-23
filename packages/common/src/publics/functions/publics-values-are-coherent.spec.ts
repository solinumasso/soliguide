/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2025 Solinum
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
  ADMINISTRATIVE_DEFAULT_VALUES,
  FAMILY_DEFAULT_VALUES,
  GENDER_DEFAULT_VALUES,
  OTHER_DEFAULT_VALUES,
  Publics,
  PublicsAdministrative,
  publicsValuesAreCoherent,
  WelcomedPublics,
} from "..";

describe("publicsValuesAreCoherent", () => {
  it("should return false when accueil is PREFERENTIAL with default values", () => {
    const publics: Publics = {
      accueil: WelcomedPublics.PREFERENTIAL,
      administrative: ADMINISTRATIVE_DEFAULT_VALUES,
      age: { min: 0, max: 99 },
      description: null,
      familialle: FAMILY_DEFAULT_VALUES,
      gender: GENDER_DEFAULT_VALUES,
      other: OTHER_DEFAULT_VALUES,
    };

    expect(publicsValuesAreCoherent(publics)).toBe(false);
  });

  it("should return true when accueil is PREFERENTIAL with default values and description", () => {
    const publics: Publics = {
      accueil: WelcomedPublics.PREFERENTIAL,
      administrative: ADMINISTRATIVE_DEFAULT_VALUES,
      age: { min: 0, max: 99 },
      description: "Open for people who live in Paris",
      familialle: FAMILY_DEFAULT_VALUES,
      gender: GENDER_DEFAULT_VALUES,
      other: OTHER_DEFAULT_VALUES,
    };

    expect(publicsValuesAreCoherent(publics)).toBe(true);
  });

  it("should return true when accueil is EXCLUSIVE with different values", () => {
    const publics: Publics = {
      accueil: WelcomedPublics.EXCLUSIVE,
      administrative: [
        PublicsAdministrative.asylum,
        PublicsAdministrative.refugee,
      ],
      age: { min: 0, max: 99 },
      description: null,
      familialle: FAMILY_DEFAULT_VALUES,
      gender: GENDER_DEFAULT_VALUES,
      other: OTHER_DEFAULT_VALUES,
    };

    expect(publicsValuesAreCoherent(publics)).toBe(true);
  });

  it("should return true when accueil is UNCONDITIONAL", () => {
    const publics: Publics = {
      accueil: WelcomedPublics.UNCONDITIONAL,
      administrative: ADMINISTRATIVE_DEFAULT_VALUES,
      age: { min: 0, max: 18 },
      description: null,
      familialle: FAMILY_DEFAULT_VALUES,
      gender: GENDER_DEFAULT_VALUES,
      other: OTHER_DEFAULT_VALUES,
    };

    expect(publicsValuesAreCoherent(publics)).toBe(true);
  });
});
