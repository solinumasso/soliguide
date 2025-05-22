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
  PlaceType,
  CampaignChangesSection,
  CountryCodes,
  DEPARTMENT_CODES,
} from "@soliguide/common";

import { CampaignList } from "../../_models";

export const CAMPAIGN_LIST: CampaignList = {
  MAJ_ETE_2022: {
    CAMPAIGN_DISPLAY_START_DATE: new Date("2022-07-07T00:00:00.000Z"),
    CAMPAIGN_END_DATE: new Date("2022-09-01T00:00:00.000Z"),
    CAMPAIGN_MESSAGE:
      "Cette structure est susceptible d'être fermée pendant les vacances d'été",
    CAMPAIGN_START_DATE: new Date("2022-06-07T00:00:00.000Z"),
    DESCRIPTION: "Mise à jour été 2022",
    PLACES_TO_UPDATE: { placeType: PlaceType.PLACE },
    SECTIONS: [
      CampaignChangesSection.tempClosure,
      CampaignChangesSection.services,
      CampaignChangesSection.tempHours,
      CampaignChangesSection.tempMessage,
    ],
    TERRITORIES: [
      "06",
      "07",
      "13",
      "15",
      "16",
      "21",
      "24",
      "33",
      "34",
      "36",
      "44",
      "56",
      "59",
      "63",
      "67",
      "75",
      "76",
      "77",
      "78",
      "87",
      "91",
      "92",
      "93",
      "94",
      "95",
    ],
  },

  MAJ_HIVER_2022: {
    CAMPAIGN_DISPLAY_START_DATE: new Date("2022-12-19T00:00:00.000Z"),
    CAMPAIGN_END_DATE: new Date("2023-01-02T00:00:00.000Z"),
    CAMPAIGN_MESSAGE:
      "Cette structure est susceptible d'être fermée pendant les vacances de noël.",
    CAMPAIGN_START_DATE: new Date("2022-11-10T10:00:00.000Z"),
    DESCRIPTION: "Mise à jour hiver 2022",
    PLACES_TO_UPDATE: null,
    SECTIONS: [
      CampaignChangesSection.tempClosure,
      CampaignChangesSection.services,
      CampaignChangesSection.tempHours,
      CampaignChangesSection.tempMessage,
    ],
    TERRITORIES: [...DEPARTMENT_CODES[CountryCodes.FR]],
  },
  MAJ_ETE_2023: {
    CAMPAIGN_DISPLAY_START_DATE: new Date("2023-07-15T00:00:00.000Z"),
    CAMPAIGN_END_DATE: new Date("2023-09-01T00:00:00.000Z"),
    CAMPAIGN_MESSAGE:
      "Cette structure est susceptible d'être fermée pendant les vacances d'été.",
    CAMPAIGN_START_DATE: new Date("2023-05-28T10:00:00.000Z"),
    DESCRIPTION: "Mise à jour été 2023",
    PLACES_TO_UPDATE: null,
    SECTIONS: [
      CampaignChangesSection.tempClosure,
      CampaignChangesSection.services,
      CampaignChangesSection.tempHours,
      CampaignChangesSection.tempMessage,
    ],
    TERRITORIES: [...DEPARTMENT_CODES[CountryCodes.FR]],
  },
  MAJ_HIVER_2023: {
    CAMPAIGN_DISPLAY_START_DATE: new Date("2023-10-19T00:00:00.000Z"),
    CAMPAIGN_END_DATE: new Date("2023-12-31T00:00:00.000Z"),
    CAMPAIGN_MESSAGE:
      "Cette structure est susceptible d'être fermée pendant les vacances de noël.",
    CAMPAIGN_START_DATE: new Date("2023-11-04T10:00:00.000Z"),
    DESCRIPTION: "Mise à jour hiver 2023",
    PLACES_TO_UPDATE: null,
    SECTIONS: [
      CampaignChangesSection.tempClosure,
      CampaignChangesSection.services,
      CampaignChangesSection.tempHours,
      CampaignChangesSection.tempMessage,
    ],
    TERRITORIES: [...DEPARTMENT_CODES[CountryCodes.FR]],
  },
  MAJ_ETE_2024: {
    CAMPAIGN_DISPLAY_START_DATE: new Date("2024-08-01T00:00:00.000Z"),
    CAMPAIGN_END_DATE: new Date("2024-09-01T00:00:00.000Z"),
    CAMPAIGN_MESSAGE:
      "Cette structure est susceptible d'être fermée pendant les vacances d'été.",
    CAMPAIGN_START_DATE: new Date("2024-06-04T00:00:00.000Z"),
    DESCRIPTION: "Mise à jour été 2024",
    PLACES_TO_UPDATE: null,
    SECTIONS: [
      CampaignChangesSection.tempClosure,
      CampaignChangesSection.services,
      CampaignChangesSection.tempHours,
      CampaignChangesSection.tempMessage,
    ],
    TERRITORIES: DEPARTMENT_CODES[CountryCodes.FR].filter(
      (code: string) => code !== "974"
    ),
  },
  END_YEAR_2024: {
    CAMPAIGN_DISPLAY_START_DATE: new Date("2024-12-20T00:00:00.000Z"),
    CAMPAIGN_END_DATE: new Date("2025-01-05T00:00:00.000Z"),
    CAMPAIGN_START_DATE: new Date("2024-11-04T00:00:00.000Z"),
    DESCRIPTION: "Mise à jour de fin d'année 2024",
    PLACES_TO_UPDATE: null,
    SECTIONS: [
      CampaignChangesSection.tempClosure,
      CampaignChangesSection.services,
      CampaignChangesSection.tempHours,
      CampaignChangesSection.tempMessage,
    ],
    TERRITORIES: [...DEPARTMENT_CODES[CountryCodes.FR]],
  },
  MID_YEAR_2025: {
    CAMPAIGN_DISPLAY_START_DATE: new Date("2025-05-01T00:00:00.000Z"),
    CAMPAIGN_END_DATE: new Date("2025-07-31T00:00:00.000Z"),
    CAMPAIGN_START_DATE: new Date("2025-05-10T00:00:00.000Z"),
    DESCRIPTION: "Mise à jour de mi-année 2025",
    PLACES_TO_UPDATE: null,
    SECTIONS: [
      CampaignChangesSection.tempClosure,
      CampaignChangesSection.services,
      CampaignChangesSection.tempHours,
      CampaignChangesSection.tempMessage,
    ],
    TERRITORIES: [...DEPARTMENT_CODES[CountryCodes.FR]],
  },
};
