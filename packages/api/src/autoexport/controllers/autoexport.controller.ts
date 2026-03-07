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
import { type ExpressRequest, type UserPopulateType } from "../../_models";

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
