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
import { Publics } from "../../publics/classes/Publics.class";
import { WelcomedPublics } from "../../publics";
import { publicsValuesAreCoherent } from "../../publics/functions/publics-values-are-coherent";
describe("Check if the 'publics' comply with rules", () => {
  it("Should return true because Welcomed publics = inconditionnal", () => {
    const defaultPublics = new Publics();
    expect(publicsValuesAreCoherent(defaultPublics)).toBeTruthy();
  });

  it("Should return true because publics is 'PREFERENTIAL', but whe don't have any changes in default values", () => {
    const defaultPublics = new Publics({
      accueil: WelcomedPublics.PREFERENTIAL,
    });
    expect(publicsValuesAreCoherent(defaultPublics)).toBeFalsy();
  });
  it("Should return false because publics is 'PREFERENTIAL', but age is different than default values", () => {
    const defaultPublics = new Publics({
      accueil: WelcomedPublics.PREFERENTIAL,
      age: {
        min: 19,
        max: 25,
      },
    });
    expect(publicsValuesAreCoherent(defaultPublics)).toBeTruthy();
  });
});
