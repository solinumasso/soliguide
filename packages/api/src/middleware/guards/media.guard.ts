import { NextFunction } from "express";

import { ExpressResponse, ExpressRequest } from "../../_models";

export const mediaGuards = {
  canUploadDocument: async (
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) => {
    req.params.objectId = req.lieu._id;
    req.params.seoUrl = req.lieu.seo_url;

    const serviceIndex =
      typeof req.params.serviceIndex !== "undefined"
        ? parseInt(req.params.serviceIndex, 10)
        : null;

    const documents =
      serviceIndex !== null
        ? // Service index
          // We look for the related service and whether there are documents already
          req.lieu.services_all[serviceIndex]?.modalities.docs
        : // No index, we look into the place access conditions
          req.lieu.modalities.docs;

    // if 'medias' is 'undefined' it means that there's no docs nor pictures and that the field does not exist in the database
    if (!documents || documents.length < 4) {
      next();
    } else {
      return res
        .status(507)
        .send({ message: "MAXIMUM_NUMBER_OF_DOCS_EXCEEDED" });
    }
  },

  // TODO: Add checks for itineraries
  canUploadPhoto: async (
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ) => {
    req.params.objectId = req.lieu._id;
    req.params.seoUrl = req.lieu.seo_url;

    const parcoursIndex =
      typeof req.params.parcoursIndex !== "undefined"
        ? parseInt(req.params.parcoursIndex, 10)
        : null;

    const photos =
      parcoursIndex !== null
        ? // Checkpoint index
          // We look for the checkpoint and whether there are pictures already
          req.lieu.parcours
          ? req.lieu.parcours[parcoursIndex]
            ? req.lieu.parcours[parcoursIndex].photos
            : null
          : null
        : // No index, we look into the place modalities
          req.lieu.photos;

    // if 'medias' is 'undefined' it means that there's no docs nor pictures and that the field does not exist in the database
    if (!photos || photos.length < 4) {
      next();
    } else {
      return res
        .status(507)
        .send({ message: "MAXIMUM_NUMBER_OF_PHOTOS_EXCEED" });
    }
  },
};
