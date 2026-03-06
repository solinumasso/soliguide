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
import { logger } from "../../general/logger";

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
      logger.error(e);
      req.log.error(e, "EXPORT_FAIL");
      res.status(500).json({ message: "EXPORT_FAIL" });
      return;
    }
  },
  logExport
);

export default router;
