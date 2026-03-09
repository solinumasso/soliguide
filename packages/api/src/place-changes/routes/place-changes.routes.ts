import express from "express";

import { searchPlaceChangesDto } from "../dto/searchPlaceChanges.dto";
import { patchStatusDto } from "../dto/patchStatus.dto";

import type { ExpressRequest, ExpressResponse } from "../../_models";
import {
  getPlaceFromUrl,
  canEditPlace,
  getPlaceChangesFromUrl,
  getFilteredData,
} from "../../middleware";
import {
  searchPlaceChanges,
  patchPlaceChange,
} from "../controllers/place-changes.controller";

const router = express.Router();

router.post(
  "/search/place/:lieu_id/:light?",
  getPlaceFromUrl,
  canEditPlace,
  searchPlaceChangesDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      req.bodyValidated.lieu_id = req.lieu.lieu_id;
      const searchResults = await searchPlaceChanges(
        req.bodyValidated,
        req.user,
        req.params?.light ? true : false
      );
      return res.status(200).json(searchResults);
    } catch (e) {
      req.log.error(e, "SEARCH_PLACE_CHANGES_FOR_A_PLACE_ERROR");
      return res
        .status(500)
        .json({ message: "SEARCH_PLACE_CHANGES_FOR_A_PLACE_ERROR" });
    }
  }
);

router.post(
  "/search",
  searchPlaceChangesDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const searchResults = await searchPlaceChanges(
        req.bodyValidated,
        req.user,
        true
      );

      return res.status(200).json(searchResults);
    } catch (e) {
      req.log.error(e, "SEARCH_PLACE_CHANGES_ERROR");
      return res.status(500).json({ message: "SEARCH_PLACE_CHANGES_ERROR" });
    }
  }
);

router.get(
  "/:placeChangeObjectId",
  getPlaceChangesFromUrl,
  getPlaceFromUrl,
  canEditPlace,
  async (req: ExpressRequest, res: ExpressResponse) => {
    return res.status(200).json(req.placeChanges);
  }
);

router.patch(
  "/:placeChangeObjectId",
  getPlaceChangesFromUrl,
  getPlaceFromUrl,
  canEditPlace,
  patchStatusDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const newPlaceChange = await patchPlaceChange(
        req.params.placeChangeObjectId,
        req.bodyValidated
      );

      return res.status(200).json(newPlaceChange);
    } catch (e) {
      req.log.error(e, "UPDATE_PLACE_ERROR");
      return res.status(500).json({ message: "UPDATE_PLACE_ERROR" });
    }
  }
);

export default router;
