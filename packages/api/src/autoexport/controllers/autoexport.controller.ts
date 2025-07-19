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
  type ApiPlace,
  ExportFileType,
  PlaceType,
  SortingOrder,
  SUPPORTED_LANGUAGES_BY_COUNTRY,
} from "@soliguide/common";

import type { ExportSearchParams } from "../interfaces";

import { printDocWord, renderCsv, renderExcel } from "../services/renders";

import { getTranslatedPlace } from "../../translations/controllers/translation.controller";
import { getUpcomingTempInfo } from "../../temp-info/services/temp-info.service";
import type { UpComingTempInfo } from "../types";
import { searchPlaces } from "../../search/controllers/search.controller";
import { CONFIG, type ExpressRequest } from "../../_models";
import { captureMessage } from "@sentry/node";
import { UserPopulateType } from "../../user/interfaces";

export const autoExport = async (
  req: ExpressRequest,
  searchData: ExportSearchParams
) => {
  const exportParams = searchData.exportParams;

  searchData.options = {
    limit: null,
    page: 1,
    skip: 0,
    sort: {
      updatedByUserAt: SortingOrder.ASCENDING,
    },
  };

  searchData.placeType = PlaceType.PLACE;

  if (CONFIG.ENV !== "dev" && CONFIG.ENV !== "test") {
    captureMessage(
      `[AUTOEXPORT] Get places info - ${new Date()} - by ${
        req.user?.mail
      } - with ${JSON.stringify(searchData)}`
    );
  }

  req.log.info(
    `[AUTOEXPORT] Get places info - ${new Date()} - by ${
      req.user?.mail
    } - with ${JSON.stringify(searchData)}`
  );
  const searchResults: {
    places: ApiPlace[];
    nbResults: number;
  } = await searchPlaces(
    req.requestInformation.categoryService,
    req.user as UserPopulateType,
    searchData,
    "EXPORT_PLACE"
  );

  // Keep only places that we need to translate
  const placesToTranslate = searchResults.places.filter(
    (place) =>
      SUPPORTED_LANGUAGES_BY_COUNTRY[place.country].source !==
      exportParams.language
  );

  const placesToKeep = searchResults.places.filter(
    (place) =>
      SUPPORTED_LANGUAGES_BY_COUNTRY[place.country].source ===
      exportParams.language
  );

  // Translate all in one time
  const translatedPlaces = await Promise.all([
    ...placesToKeep,
    ...(await Promise.all(
      placesToTranslate.map((place) =>
        getTranslatedPlace(place, exportParams.language)
      )
    )),
  ]);

  searchResults.places = translatedPlaces;
  req.nbResults = searchResults.nbResults;

  let upcomingTempInfo: UpComingTempInfo = [];

  if (exportParams.showUpcomingTempInfo) {
    const placesIds = searchResults.places.map(
      (place: ApiPlace) => place.lieu_id
    );

    upcomingTempInfo = await getUpcomingTempInfo(placesIds);
  }

  if (CONFIG.ENV !== "dev" && CONFIG.ENV !== "test") {
    captureMessage(
      `[AUTOEXPORT] Start export - ${new Date()} - by ${
        req.user?.mail
      } - with ${JSON.stringify(searchData)}`
    );
  }
  req.log.info(
    `[AUTOEXPORT] Start export - ${new Date()} - by ${
      req.user?.mail
    } - with ${JSON.stringify(searchData)}`
  );

  if (
    exportParams.fileType === ExportFileType.WORD ||
    exportParams.fileType === ExportFileType.PDF
  ) {
    return printDocWord(
      req.requestInformation.frontendUrl,
      req.requestInformation.categoryService,
      searchResults.places,
      searchData,
      upcomingTempInfo
    );
  } else if (exportParams.fileType === ExportFileType.CSV) {
    return renderCsv(
      req.requestInformation.frontendUrl,
      req.requestInformation.categoryService,
      searchResults.places,
      searchData,
      upcomingTempInfo
    );
  } else if (exportParams.fileType === ExportFileType.XLSX) {
    return renderExcel(
      req.requestInformation.frontendUrl,
      req.requestInformation.categoryService,
      searchResults.places,
      searchData,
      upcomingTempInfo
    );
  }
};
