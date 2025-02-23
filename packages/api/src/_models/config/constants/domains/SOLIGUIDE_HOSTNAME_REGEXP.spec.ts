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
import { SOLIGUIDE_HOSTNAME_REGEXP } from "./SOLIGUIDE_HOSTNAME_REGEXP.const";

describe("Soliguide hostname regexp", () => {
  [
    "app.soliguide.fr",
    "app.soliguide.cat",
    "soliguide.fr",
    "soliguide.dev",
    "toto.soliguide.fr",
    "demo.soliguide.dev",
    "fr.demo.soliguide.dev",
    "es.demo.soliguide.dev",
    "ad.demo.soliguide.dev",
    "soliguia.soliguide.dev",
    "soliguia.es",
    "soliguia.cat",
    "soliguia.ad.es",
  ].forEach((hostname) => {
    it(`✅ ${hostname} should match`, () => {
      expect(SOLIGUIDE_HOSTNAME_REGEXP.test(hostname)).toEqual(true);
    });
  });

  [
    "google.fr",
    "soliguide.ro",
    "toto.soliguide.ro",
    "soliguide.es",
    "soliguia.fr",
  ].forEach((hostname) => {
    it(`❌ ${hostname} should not match`, () => {
      expect(SOLIGUIDE_HOSTNAME_REGEXP.test(hostname)).toEqual(false);
    });
  });
});
