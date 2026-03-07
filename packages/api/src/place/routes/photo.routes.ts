import express from "express";

const router = express.Router();

import type { ExpressRequest, ExpressResponse } from "../../_models";
import { getPlaceFromUrl, canEditPlace, mediaGuards } from "../../middleware";
import { addPhoto, deletePhoto, uploadImg } from "../controllers";

router.post(
  "/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  mediaGuards.canUploadPhoto,
  uploadImg,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const photo = await addPhoto(req);

      return res.status(200).json(photo);
    } catch (err) {
      req.log.error(err);
      return res.status(500).json({ message: "ADD_PHOTO_FICHE_ERROR" });
    }
  }
);

router.delete(
  "/:lieu_id/:photoObjectId/:parcoursId?",
  getPlaceFromUrl,
  canEditPlace,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const place = await deletePhoto(req);

      return res.status(200).json(place);
    } catch (err) {
      req.log.error(err);
      return res.status(500).json({ message: "DELETE_PHOTO_FICHE_ERROR" });
    }
  }
);

export default router;
