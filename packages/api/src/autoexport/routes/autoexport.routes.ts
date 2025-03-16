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
import {
  ExportFileType,
  EXPORT_CONTENT_TYPE,
  UserStatus,
} from "@soliguide/common";

import { NextFunction, Router } from "express";

import * as AutoExportController from "../controllers/autoexport.controller";

import { AutoExportDto } from "../dto/AutoExportDto";

import { CONFIG, ExpressRequest, ExpressResponse } from "../../_models";

import { checkRights, getFilteredData, logExport } from "../../middleware";
import { captureMessage } from "@sentry/node";

export const router = Router();

/**
 * tags:
 *   name: AutoExport
 *   description: All routes related to auto export
 */
router.post(
  "/",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  AutoExportDto,
  getFilteredData,
  async (
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction
  ): Promise<void> => {
    const searchData = req.bodyValidated;

    req.exportStartedAt = new Date();

    try {
      const data = await AutoExportController.autoExport(req, searchData);

      if (CONFIG.ENV !== "dev" && CONFIG.ENV !== "test") {
        captureMessage(
          `[AUTOEXPORT] Export generated - ${new Date()} - by ${
            req.user?.mail
          } - with ${JSON.stringify(searchData)}`
        );
      }
      req.log.info(
        `[AUTOEXPORT] Export generated - ${new Date()} - by ${
          req.user?.mail
        } - with ${JSON.stringify(searchData)}`
      );

      const fileType: ExportFileType = searchData.exportParams.fileType;

      res.set("Content-Type", EXPORT_CONTENT_TYPE[fileType]);
      res.send(data);
      next();
    } catch (e) {
      console.log(e);
      req.log.error(e, "EXPORT_FAIL");
      res.status(500).json({ message: "EXPORT_FAIL" });
      return;
    }
  },
  logExport
);

export default router;
