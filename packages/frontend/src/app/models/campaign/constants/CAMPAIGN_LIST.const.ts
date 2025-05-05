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
  CampaignName,
  CountryCodes,
  DEPARTMENT_CODES,
} from "@soliguide/common";

import { CampaignInfos } from "../types";

export const CAMPAIGN_LIST: { [key in CampaignName]: CampaignInfos } = {
  MAJ_ETE_2022: {
    adjective: "estivale",
    closingFormula: "Bel été",
    dateDebutAffichage: new Date("2022-07-07T00:00:00.000Z"),
    dateDebutCampagne: new Date("2022-06-07T10:00:00.000Z"),
    dateFin: new Date("2022-09-01T00:00:00.000Z"),
    description: "Mise à jour été 2022",
    icon: "sun",
    name: "été",
    period: "juillet-août",
    territories: [...DEPARTMENT_CODES[CountryCodes.FR]],
  },
  MAJ_ETE_2023: {
    adjective: "estivale",
    closingFormula: "Bel été",
    dateDebutAffichage: new Date("2023-07-15T00:00:00.000Z"),
    dateDebutCampagne: new Date("2023-05-28T10:00:00.000Z"),
    dateFin: new Date("2023-09-01T00:00:00.000Z"),
    description: "Mise à jour été 2023",
    icon: "sun",
    name: "été",
    period: "juillet-août",
    specificServiceMessage: "SPECIFIC_SERVICE_FOR_HEATWAVES",
    territories: [...DEPARTMENT_CODES[CountryCodes.FR]],
  },
  MAJ_ETE_2024: {
    adjective: "estivale",
    closingFormula: "Bel été",
    dateDebutAffichage: new Date("2024-08-01T00:00:00.000Z"),
    dateDebutCampagne: new Date("2024-06-04T00:00:00.000Z"),
    dateFin: new Date("2024-09-01T00:00:00.000Z"),
    description: "Mise à jour été 2024",
    icon: "sun",
    name: "été",
    period: "juillet-août",
    specificServiceMessage: "SPECIFIC_SERVICE_FOR_HEATWAVES",
    territories: DEPARTMENT_CODES[CountryCodes.FR].filter(
      (code) => code !== "974"
    ),
  },
  MAJ_HIVER_2022: {
    adjective: "hivernale",
    closingFormula: "Bonnes fêtes de fin d’année",
    dateDebutAffichage: new Date("2022-12-19T00:00:00.000Z"),
    dateDebutCampagne: new Date("2022-11-07T01:00:00.000Z"),
    dateFin: new Date("2023-01-02T00:00:00.000Z"),
    description: "Mise à jour hiver 2022",
    icon: "snow",
    name: "hiver",
    period: "décembre-janvier",
    territories: [...DEPARTMENT_CODES[CountryCodes.FR]],
  },
  MAJ_HIVER_2023: {
    adjective: "hivernale",
    closingFormula: "Bonnes fêtes de fin d’année",
    dateDebutAffichage: new Date("2023-12-19T00:00:00.000Z"),
    dateDebutCampagne: new Date("2023-11-04T01:00:00.000Z"),
    dateFin: new Date("2023-12-31T00:00:00.000Z"),
    description: "Mise à jour hiver 2023",
    icon: "snow",
    name: "hiver",
    period: "décembre-janvier",
    specificServiceMessage: "SPECIFIC_SERVICE_FOR_WINTER",
    territories: [...DEPARTMENT_CODES[CountryCodes.FR]],
  },
  END_YEAR_2024: {
    closingFormula: "Bonne fin d'année",
    dateDebutAffichage: new Date("2024-12-20T00:00:00.000Z"),
    dateDebutCampagne: new Date("2024-11-04T00:00:00.000Z"),
    dateFin: new Date("2025-01-05T00:00:00.000Z"),
    description: "Mise à jour de fin d'année 2024",
    name: "fin d'année",
    period: "décembre-janvier",
    specificServiceMessage: "",
    territories: [...DEPARTMENT_CODES[CountryCodes.FR]],
  },
  MID_YEAR_2025: {
    closingFormula: "Bonne fin d'année",
    dateDebutAffichage: new Date("2024-12-20T00:00:00.000Z"),
    dateDebutCampagne: new Date("2024-11-04T00:00:00.000Z"),
    dateFin: new Date("2025-07-31T00:00:00.000Z"),
    description: "Mise à jour de fin d'année 2024",
    name: "fin d'année",
    period: "décembre-janvier",
    specificServiceMessage: "",
    territories: [...DEPARTMENT_CODES[CountryCodes.FR]],
  },
};
