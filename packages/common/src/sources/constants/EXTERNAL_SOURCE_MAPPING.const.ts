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
import { PairingSources } from "../enums";

export const EXTERNAL_SOURCE_MAPPING: Record<
  PairingSources,
  { label: string; licenseLink?: string; licenseLabel?: string }
> = {
  [PairingSources.DORA]: {
    label: "DORA via data·inclusion",
    licenseLink: "https://www.etalab.gouv.fr/licence-ouverte-open-licence/",
    licenseLabel: "licence Open Data",
  },
  [PairingSources.CRF]: { label: "Croix-Rouge française" },
  [PairingSources.ALISOL]: { label: "Alisol (AD2S)" },
};
