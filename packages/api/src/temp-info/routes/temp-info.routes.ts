/*
 * Soliguide: Useful information for those who need it
 *
 * SPDX-FileCopyrightText: © 2024 Solinum
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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

import type { ExpressRequest, ExpressResponse } from "../../_models";

import { parseObjectIdOptionalDto } from "../../_utils/dto";

import {
  canEditPlace,
  getFilteredData,
  getPlaceFromUrl,
} from "../../middleware";

import { generateElementsToTranslate } from "../../translations/controllers/translation.controller";
import { patchClosedServices } from "../../place/controllers";
import { sendPlaceChangesToMq } from "../../place-changes/middlewares/send-place-changes-to-mq.middleware";
import { UserForLogs } from "../../user/interfaces";

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
