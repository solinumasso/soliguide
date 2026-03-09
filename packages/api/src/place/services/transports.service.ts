import { ApiPlace } from "@soliguide/common";
import axios from "axios";
import { NextFunction } from "express";
import {
  AXIOS_CONFIG,
  CONFIG,
  ExpressRequest,
  ExpressResponse,
  ModelWithId,
} from "../../_models";
import { logger } from "../../general/logger";

const apiBaseUrl = `${CONFIG.SOLIGUIDE_LOCATION_API_URL}/transports/`;

export const refreshTransportsCache = async (
  req: ExpressRequest & {
    updatedPlace: ModelWithId<ApiPlace>;
  },
  _res: ExpressResponse,
  next: NextFunction
) => {
  try {
    const latitude = req.updatedPlace.position.location.coordinates[1];
    const longitude = req.updatedPlace.position.location.coordinates[0];

    const axiosResponse = await axios.get(
      `${apiBaseUrl}${latitude}/${longitude}/${req.updatedPlace.lieu_id}?refresh=true`,
      {
        ...AXIOS_CONFIG,
        timeout: 5000, // Timeout de 5 secondes pour éviter les blocages
      }
    );

    if (axiosResponse.status !== 200) {
      logger.error(
        `Error refreshing transports cache for place id ${req.updatedPlace.lieu_id}`
      );
    }
  } catch (e) {
    // Log l'erreur mais ne fait pas planter la requête, comme generateElementsToTranslate
    req.log.error("REFRESH_TRANSPORTS_CACHE_FAIL", e);
  }

  next();
};
