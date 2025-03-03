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
import { Themes } from "@soliguide/common";
import { THEME_MAPPINGS } from "../../../_models";
import { cleanUrl } from "./cleanUrl.service";

export const getThemeFromOrigin = (origin: string | null): Themes | null => {
  if (!origin) {
    return null;
  }

  try {
    const cleanedOrigin = cleanUrl(origin);
    if (!cleanedOrigin) {
      return null;
    }

    const hostname = new URL(cleanedOrigin).hostname;
    for (const [url, theme] of Object.entries(THEME_MAPPINGS)) {
      if (new URL(url).hostname === hostname) {
        return theme;
      }
    }

    return null;
  } catch {
    return null;
  }
};
