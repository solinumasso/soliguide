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
import { CampaignName } from "@soliguide/common";

export const CAMPAIGN_NAME_LABELS: { [key in CampaignName]: string } = {
  MAJ_ETE_2022: "Mise à jour été 2022",
  MAJ_ETE_2023: "Mise à jour été 2023",
  MAJ_ETE_2024: "Mise à jour été 2024",
  MAJ_HIVER_2022: "Mise à jour hiver 2022",
  MAJ_HIVER_2023: "Mise à jour hiver 2023",
  END_YEAR_2024: "Mise à jour de fin d'année 2024",
  MID_YEAR_2025: "Mise à jour de mi-année 2025",
  END_YEAR_2025: "Mise à jour de fin d'année 2025",
};
