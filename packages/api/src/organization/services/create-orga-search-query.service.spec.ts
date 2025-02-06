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
import {
  CAMPAIGN_DEFAULT_NAME,
  CampaignStatusForSearch,
  CountryAreaTerritories,
  CountryCodes,
  UserStatus,
} from "@soliguide/common";

import { createOrgaSearchQuery } from "./createOrgaSearchQuery";

import * as PlaceService from "../../place/services/place.service";

import { ONLINE_PLACE } from "../../../mocks/places/ONLINE_PLACE.mock";
import { UserPopulateType } from "../../_models";

describe("createOrgaSearchQuery", () => {
  beforeEach(() => {
    ONLINE_PLACE.lieu_id = 1;
    jest.spyOn(PlaceService, "getPlaceByParams").mockReturnValue(
      new Promise((resolve) => {
        resolve(ONLINE_PLACE);
      })
    );
  });

  it("Search an organization for admin territory", async () => {
    const user = {
      status: UserStatus.ADMIN_TERRITORY,
      territories: ["01", "03", "978", "984", "986", "987", "988"],
      areas: {
        fr: new CountryAreaTerritories<CountryCodes.FR>({
          departments: ["01", "03"],
        }),
      },
    } as UserPopulateType;

    const query = {
      campaignStatus: CampaignStatusForSearch.TO_DO,
      lieu_id: ONLINE_PLACE.lieu_id,
      name: "Organisation",
      organization_id: 0,
      priority: true,
      country: CountryCodes.FR,
      relations: ["NO_RELATION", "API"],
      territories: ["01"],
      userTypes: ["NONE", "USERS"],
    };

    const nosqlQuery = {
      $and: [
        { places: { $in: ["5a58c0c7c1797fe45e3772ab"] } },
        { organization_id: 0 },
        {
          name: {
            $options: "i",
            $regex: new RegExp(".*Organisation.*"),
          },
        },
        { priority: true },
        {
          [`campaigns.${CAMPAIGN_DEFAULT_NAME}.status`]:
            CampaignStatusForSearch.TO_DO,
        },
        { $or: [{ relations: { $size: 0 } }, { relations: { $in: ["API"] } }] },
        {
          $or: [
            { "counters.users.TOTAL": { $gte: 1 } },
            {
              "counters.invitations.TOTAL": 0,
              "counters.users.TOTAL": 0,
            },
          ],
        },
      ],
      "areas.fr.departments": {
        $in: ["01"],
      },
      name: {
        $options: "i",
        $regex: /.*Organisation.*/,
      },
    };
    const result = await createOrgaSearchQuery(query, user);
    expect(result).toStrictEqual(nosqlQuery);
  });
});
