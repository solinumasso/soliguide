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
import { ApiPlace, CommonPlaceSource } from "../../place";
import {
  EXTERNAL_UPDATES_ONLY_SOURCES,
  PAIRING_SOURCES,
  SOURCES_DISPLAY_EXTERNAL_LINK,
} from "../constants";

export const checkIfSourceMustBeDisplayed = (
  sourceName: string,
  isOrigin: boolean
): boolean =>
  EXTERNAL_UPDATES_ONLY_SOURCES.includes(sourceName as PairingSources) ||
  (PAIRING_SOURCES.includes(sourceName as PairingSources) && isOrigin);

export const isFromExternalSource = (place: ApiPlace): boolean => {
  if (!place.sources) {
    return false;
  }

  return place.sources.some((source) =>
    checkIfSourceMustBeDisplayed(source.name, source.isOrigin)
  );
};

export const getSourceUrl = (source: CommonPlaceSource): string => {
  if (SOURCES_DISPLAY_EXTERNAL_LINK.includes(source.name as PairingSources)) {
    return source.ids.find((id) => id?.url)?.url ?? "";
  }
  return "";
};
