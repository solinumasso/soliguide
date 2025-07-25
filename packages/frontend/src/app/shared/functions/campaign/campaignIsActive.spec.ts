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
import { CAMPAIGN_DEFAULT_NAME, CAMPAIGN_LIST } from "@soliguide/common";

import { campaignIsActiveWithTheme } from "./campaignIsActive";

describe("Test la fonction campaignIsActive", () => {
  it("Doit renvoyer 'false' si on est hors période de campagne et 'true' sinon", () => {
    const TODAY = new Date();

    if (
      TODAY < CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].dateDebutCampagne ||
      TODAY > CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].dateFin
    ) {
      expect(
        campaignIsActiveWithTheme(
          CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].territories
        )
      ).toBeFalsy();
    } else {
      expect(
        campaignIsActiveWithTheme(
          CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME].territories
        )
      ).toBeTruthy();
    }
  });
});
