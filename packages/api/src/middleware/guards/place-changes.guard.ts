import type { NextFunction } from "express";
import type { ExpressRequest, ExpressResponse } from "../../_models";
import { findOnePlaceChanges } from "../../place-changes/services/place-changes.service";

export const getPlaceChangesFromUrl = async (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  try {
    const placeChange = await findOnePlaceChanges({
      _id: req.params.placeChangeObjectId,
    });

    if (placeChange) {
      req.placeChanges = placeChange;
      req.params.lieu_id = placeChange.lieu_id.toString();
      next();
    } else {
      return res.status(404).json("CHANGES_NOT_FOUND");
    }
  } catch (e) {
    req.log.error(e);
    return res.status(400).json("SEARCH_CHANGES_ERROR");
  }
};
