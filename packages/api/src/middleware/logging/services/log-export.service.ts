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
  ExportFileType,
  type ExportParams,
  PlaceType,
  SortingOrder,
} from "@soliguide/common";
import { ExpressRequest } from "../../../_models";
import { LogExport } from "../../../logging/interfaces";
import { LogExportModel } from "../../../logging/models/log-export.model";
import { getAreasFromLocation } from "../../../search/services";

const parseExportParams = (exportParams: ExportParams): Partial<LogExport> => {
  return {
    fileType: exportParams?.fileType
      ? exportParams.fileType
      : ExportFileType.CSV,
    selectedParams: exportParams?.infos,
    sortingFilter: exportParams?.sortingFilter
      ? exportParams.sortingFilter
      : undefined,
  };
};

const parseSearchParams = (searchParams: any): Partial<LogExport> => {
  return {
    category: searchParams.category,
    languages: searchParams.languages,
    location: searchParams.location,
    modalities: searchParams.modalities,
    options: {
      page: 1,
      sortBy: "updatedAt",
      sortValue: SortingOrder.ASCENDING,
      limit: 100,
    },
    placeType: PlaceType.PLACE,
    publics: searchParams.publics,
    word: searchParams.word,
  };
};

export const logExport = async (req: ExpressRequest) => {
  const searchData = {
    ...parseExportParams(req.bodyValidated.exportParams),
    ...parseSearchParams(req.bodyValidated),
    exportEndedAt: new Date(),
    exportStartedAt: req.exportStartedAt,
    nbResults: req.nbResults,
    userDatas: req.userForLogs,
  };

  try {
    if (searchData.location) {
      searchData.location.areas = await getAreasFromLocation(
        searchData.location
      );
    } else {
      req.log.error("Location data are emtpy");
    }
  } catch (e) {
    req.log.error(e, "GET_AREAS_ERROR");
  }

  try {
    await LogExportModel.create(searchData);
  } catch (e) {
    req.log.error(e, "LOG_EXPORT_ERROR");
  }
};
