/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { PlaceType } from "@soliguide/common";
import { seoUrl } from "./slugs.services";

describe("seoUrl", () => {
  [
    {
      in: {
        name: "CCAS du 3ème arrondissement de Paris",
        placeType: PlaceType.PLACE,
        position: {
          ville: "Paris",
        },
        lieu_id: 0,
      },
      out: "ccas-du-3eme-arrondissement-de-paris-0",
    },
    {
      in: {
        name: "Maraude Cébazat",
        placeType: PlaceType.ITINERARY,
        lieu_id: 100,
      },
      out: "maraude-cebazat-100",
    },
  ].forEach((value) => {
    it(`SEO URL: ${value.in}`, () => {
      expect(seoUrl(value.in as any)).toEqual(value.out);
    });
  });
});
