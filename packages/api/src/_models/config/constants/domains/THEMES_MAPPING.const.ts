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
import { Themes } from "@soliguide/common";
import { CONFIG } from "../CONFIG.const";

export const THEME_MAPPINGS: { [key: string]: Themes } = {
  [CONFIG.SOLIGUIA_AD_URL]: Themes.SOLIGUIA_AD,
  [CONFIG.SOLIGUIA_ES_URL]: Themes.SOLIGUIA_ES,
  [CONFIG.SOLIGUIDE_FR_URL]: Themes.SOLIGUIDE_FR,
  [CONFIG.WEBAPP_AD_URL]: Themes.SOLIGUIA_AD,
  [CONFIG.WEBAPP_ES_URL]: Themes.SOLIGUIA_ES,
  [CONFIG.WEBAPP_FR_URL]: Themes.SOLIGUIDE_FR,
} as const;

export const FRONT_URLS_MAPPINGS: { [key: string]: string } = {
  [Themes.SOLIGUIA_AD]: CONFIG.SOLIGUIA_AD_URL,
  [Themes.SOLIGUIA_ES]: CONFIG.SOLIGUIA_ES_URL,
  [Themes.SOLIGUIDE_FR]: CONFIG.SOLIGUIDE_FR_URL,
};
