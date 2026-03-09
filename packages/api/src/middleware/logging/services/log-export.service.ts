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
