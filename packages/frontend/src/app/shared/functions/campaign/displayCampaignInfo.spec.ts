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
import { displayCampaignInfo } from "./displayCampaignInfo";

import { Place, Service } from "../../../models";
import { Categories } from "@soliguide/common";

jest.mock("@soliguide/common", () => {
  const original = jest.requireActual("@soliguide/common");
  const CAMPAIGN_DEFAULT_NAME = "MAJ_TEST";
  const CAMPAIGN_LIST = {
    MAJ_TEST: {
      dateDebutAffichage: new Date("2020-06-15T00:00:00.000Z"),
      dateDebutCampagne: new Date("2020-06-01T01:00:00.000Z"),
      dateFin: new Date("2020-09-01T00:00:00.000Z"),
    },
  };

  return {
    ...original,
    CAMPAIGN_DEFAULT_NAME,
    CAMPAIGN_LIST,
    campaignIsActive: () => {
      const today = new Date();
      const campaign = CAMPAIGN_LIST[CAMPAIGN_DEFAULT_NAME];

      if (campaign.dateDebutCampagne > today || today > campaign.dateFin) {
        return false;
      }

      return true;
    },
  };
});

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2020-06-01T01:00:00.000Z"));
});

describe("DisplayCampaignInfos", () => {
  const PLACE = new Place();

  it("Default campaign + default place : false", () => {
    PLACE.services_all = [new Service()];
    expect(displayCampaignInfo(PLACE)).toBe<boolean>(false);
  });

  it("Place avec Fontaine: false", () => {
    PLACE.services_all = [new Service()];
    PLACE.services_all[0].category = Categories.FOUNTAIN;
    expect(displayCampaignInfo(PLACE)).toBe<boolean>(false);
  });

  it("Campagne passée ou à venir: false", () => {
    // Autre service que les fontaines
    PLACE.services_all[0].category = Categories.DIGITAL_TOOLS_TRAINING;
    jest.setSystemTime(new Date("2021-09-10T10:00:00.000Z"));
    expect(displayCampaignInfo(PLACE)).toBe<boolean>(false);
    jest.setSystemTime(new Date("2020-03-10T10:00:00.000Z"));
    expect(displayCampaignInfo(PLACE)).toBe<boolean>(false);
  });

  it("Campagne en cours: true", () => {
    PLACE.services_all[0].category = Categories.DIGITAL_TOOLS_TRAINING;
    PLACE.campaigns.runningCampaign.toUpdate = true;
    // Date de dernière mise à jour avant le début de la campagne
    PLACE.updatedByUserAt = new Date("2020-03-21T10:00:00.000Z");
    jest.setSystemTime(new Date("2020-07-10T10:00:00.000Z"));
    expect(displayCampaignInfo(PLACE)).toBe<boolean>(true);
  });
});
