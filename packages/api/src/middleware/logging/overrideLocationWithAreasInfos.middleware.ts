import type { NextFunction } from "express";

import type { ExpressRequest, ExpressResponse } from "../../_models";

import { getAreasFromLocation } from "../../search/services";

export const overrideLocationWithAreasInfo = async (
  req: ExpressRequest,
  _res: ExpressResponse,
  next: NextFunction
): Promise<void> => {
  try {
    const areas = await getAreasFromLocation(req.bodyValidated.location);
    // Necessary for adding location informations when request is from web-app
    req.bodyValidated.location = {
      ...req.bodyValidated.location,
      department: areas.department,
      region: areas.region,
      departmentCode: areas.departmentCode,
      regionCode: areas.regionCode,
      country: areas.country,
    };
  } catch (e) {
    req.log.error(e, "GET_AREAS_FROM_LOCATION_FAILED");
  }

  next();
};
