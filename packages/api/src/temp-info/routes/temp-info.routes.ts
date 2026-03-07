import { TempInfoType } from "@soliguide/common";

import express, { type NextFunction } from "express";

import {
  getTempInfoByType,
  deleteTempInfo,
  patchTempInfoByType,
} from "../controllers/temp-info.controller";
import { rebuildTempServiceClosure } from "../controllers/temp-service-closure.controller";

import {
  baseTempInfoDto,
  startAndEndDateDto,
  tempInfoInServicesDto,
  tempInfoUrlParamDto,
} from "../dto";

import { checkTempInfoInterval } from "../utils/temp-info.utils";

import type {
  ExpressRequest,
  ExpressResponse,
  UserForLogs,
} from "../../_models";

import { parseObjectIdOptionalDto } from "../../_utils/dto";

import {
  canEditPlace,
  getFilteredData,
  getPlaceFromUrl,
} from "../../middleware";

import { generateElementsToTranslate } from "../../translations/controllers/translation.controller";
import { patchClosedServices } from "../../place/controllers";
import { sendPlaceChangesToMq } from "../../place-changes/middlewares/send-place-changes-to-mq.middleware";

const router = express.Router();

router.get(
  "/:tempInfoType/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  tempInfoUrlParamDto,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const tempInfo = await getTempInfoByType(
        req.params.tempInfoType as TempInfoType,
        req.lieu
      );

      return res.status(200).json({ place: req.lieu, tempInfo });
    } catch (e) {
      const message = `GET_TEMP_${req.params.tempInfoType.toUpperCase()}_FAIL`;
      req.log.error(e, message);
      return res.status(500).json(message);
    }
  }
);

router.patch(
  "/services/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  tempInfoInServicesDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const result = await patchClosedServices(
        req.bodyValidated,
        req.lieu,
        req.userForLogs as UserForLogs
      );

      req.placeChanges = result.placeChanges;
      req.updatedPlace = result.updatedPlace;

      res.status(200).json(req.updatedPlace);
      next();
    } catch (e) {
      req.log.error(e, "PATCH_TEMP_SERVICE_CLOSE_FAIL");
      return res.status(500).json("PATCH_TEMP_SERVICE_CLOSE_FAIL");
    }
  },
  rebuildTempServiceClosure,
  sendPlaceChangesToMq
);

router.patch(
  "/:tempInfoType/:lieu_id",
  getPlaceFromUrl,
  canEditPlace,
  tempInfoUrlParamDto,
  baseTempInfoDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const { place, placeChanges } = await patchTempInfoByType(
        req.bodyValidated,
        req.lieu,
        req.userForLogs as UserForLogs
      );

      req.updatedPlace = place;
      req.placeChanges = placeChanges;

      const tempInfo = await getTempInfoByType(
        req.params.tempInfoType as TempInfoType,
        req.lieu
      );

      res.status(200).json({
        place: req.updatedPlace,
        tempInfo,
      });
      next();
    } catch (e) {
      const message = `PATCH_TEMP_${req.params.tempInfoType.toUpperCase()}_FAIL`;
      req.log.error(e, message);
      return res.status(500).json(message);
    }
  },
  generateElementsToTranslate,
  rebuildTempServiceClosure,
  sendPlaceChangesToMq
);

router.post(
  "/check-date-interval/:lieu_id/:tempInfoType",
  getPlaceFromUrl,
  canEditPlace,
  tempInfoUrlParamDto,
  parseObjectIdOptionalDto,
  startAndEndDateDto(""),
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      await checkTempInfoInterval(
        req.lieu.lieu_id,
        req.bodyValidated,
        req.params.tempInfoType as TempInfoType,
        false
      );
      return res.status(200).json(true);
    } catch (e) {
      return res.status(200).json(false);
    }
  }
);

router.delete(
  "/:tempInfoType/:lieu_id/:tempInfoId",
  getPlaceFromUrl,
  canEditPlace,
  tempInfoUrlParamDto,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const result = await deleteTempInfo(
        req.params.tempInfoId,
        req.params.tempInfoType as TempInfoType,
        req.lieu,
        req.userForLogs as UserForLogs
      );

      req.updatedPlace = result.place;

      res.status(200).json(result);
      next();
    } catch (e) {
      const message = `DELETE_TEMP_${req.params.tempInfoType.toUpperCase()}_FAIL`;
      req.log.error(e, message);
      return res.status(500).json(message);
    }
  },
  rebuildTempServiceClosure,
  sendPlaceChangesToMq
);

export default router;
