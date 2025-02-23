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
import { ExpressRequest, FRONT_URLS_MAPPINGS, Origin } from "../../../_models";
import {
  SupportedLanguagesCode,
  type CategoriesService,
  Themes,
} from "@soliguide/common";
import {
  handleLanguageByTheme,
  handleOrigin,
  handleOriginForLogs,
  handleReferer,
} from "../services";
import { getThemeFromOrigin } from "../services/getThemeFromOrigin.service";
import { getServiceCategoriesApi } from "../../../categories/functions/get-service-categories-api.function";

export class RequestInformation {
  public readonly originForLogs: Origin;
  public readonly origin: string | null;
  public readonly frontendUrl: string;
  public readonly referer: string | null = null;
  public readonly theme: Themes | null = null;

  public categoryService: CategoriesService;
  public language?: SupportedLanguagesCode;

  constructor(req: ExpressRequest) {
    this.referer = handleReferer(req);
    this.origin = handleOrigin(req);
    this.originForLogs = handleOriginForLogs(req, this.origin);
    this.theme = getThemeFromOrigin(this.origin);

    this.frontendUrl = this.theme
      ? `${FRONT_URLS_MAPPINGS[this.theme]}/`
      : `${FRONT_URLS_MAPPINGS[Themes.SOLIGUIDE_FR]}/`; // Fallback for urls that are not in the mappings
    this.categoryService = getServiceCategoriesApi(this.theme);
    this.language = handleLanguageByTheme(this.theme);
  }
}
