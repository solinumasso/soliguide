/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2025 Solinum
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
import { CONFIG } from "../CONFIG.const";

export const FRONT_URLS = [
  CONFIG.SOLIGUIA_AD_URL,
  CONFIG.SOLIGUIA_ES_URL,
  CONFIG.SOLIGUIDE_FR_URL,
];

export const WEBAPP_URLS = [
  CONFIG.WEBAPP_FR_URL,
  CONFIG.WEBAPP_ES_URL,
  CONFIG.WEBAPP_AD_URL,
];

export const SOLIGUIDE_URLS = [...FRONT_URLS, ...WEBAPP_URLS];
