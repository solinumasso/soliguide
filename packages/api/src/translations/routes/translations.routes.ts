import express from "express";

const router = express.Router();

import { UserStatus } from "@soliguide/common";

import {
  searchTranslatedElementDto,
  searchTranslatedPlaceDto,
  translatedElementDto,
} from "../dto";

import { ApiTranslatedField } from "../interfaces";
import type { ExpressRequest, ExpressResponse } from "../../_models";

import {
  isTranslator,
  getTranslatedFieldFromUrl,
  checkRights,
  getFilteredData,
} from "../../middleware";
import {
  patchTranslatedField,
  searchTranslatedFields,
  searchTranslatedPlaces,
} from "../controllers/translation.controller";

// ROUTE 1: Look for elements to translate
router.post(
  "/search",
  isTranslator,
  searchTranslatedElementDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const results = await searchTranslatedFields(req.bodyValidated, req.user);
      return res.status(200).json(results);
    } catch (e) {
      req.log.error(e, "SEARCH_TRANSLATED_FIELDS_FAILED");
      return res
        .status(500)
        .json({ message: "SEARCH_TRANSLATED_FIELDS_FAILED" });
    }
  }
);

// ROUTE 2: Look for places to translate
router.post(
  "/search-places",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  searchTranslatedPlaceDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const results = await searchTranslatedPlaces(req.bodyValidated, req.user);
      return res.status(200).json(results);
    } catch (e) {
      req.log.error(e, "SEARCH_TRANSLATED_PLACES_FAILED");
      return res
        .status(500)
        .json({ message: "SEARCH_TRANSLATED_PLACES_FAILED" });
    }
  }
);

router.get(
  "/is-translator",
  isTranslator,
  (_req: ExpressRequest, res: ExpressResponse) => {
    return res.status(200).json(true);
  }
);

router.get(
  "/:translatedFieldObjectId",
  isTranslator,
  getTranslatedFieldFromUrl,
  (req: ExpressRequest, res: ExpressResponse) => {
    return res.status(200).json(req.translatedField);
  }
);

router.patch(
  "/:translatedFieldObjectId",
  isTranslator,
  getTranslatedFieldFromUrl,
  translatedElementDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      await patchTranslatedField(
        req.user,
        req.translatedField as ApiTranslatedField,
        req.bodyValidated,
        req.log
      );

      return res
        .status(200)
        .json({ message: "PATCH_TRANSLATED_FIELD_SUCCEEDED" });
    } catch (e) {
      req.log.error(e, "PATCH_TRANSLATED_FIELD_FAILED");
      return res.status(500).json({ message: "PATCH_TRANSLATED_FIELD_FAILED" });
    }
  }
);

export default router;
