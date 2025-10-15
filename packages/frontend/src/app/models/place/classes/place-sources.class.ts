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
  type CommonPlaceSource,
  checkIfSourceMustBeDisplayed,
  PlaceSourceId,
  getSourceUrl,
} from "@soliguide/common";

export class PlaceSource {
  public name: string;
  public ids: PlaceSourceId[];
  public isOrigin: boolean;
  public license?: string;
  public externalUrl: string;
  public toDisplay?: boolean;

  constructor(source: CommonPlaceSource) {
    this.name = source.name;
    this.ids = source.ids;
    this.isOrigin = source.isOrigin;

    if (source?.license) {
      this.license = source.license;
    }

    this.toDisplay = checkIfSourceMustBeDisplayed(source.name, source.isOrigin);
    this.externalUrl = getSourceUrl(source);
  }
}
