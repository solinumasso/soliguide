import express from "express";

import { UserStatus } from "@soliguide/common";

import { checkDuplicatesByPlace } from "../controllers";

import { checkDuplicatesByPlaceDto, formatAddressDto } from "../dto";

import { type ExpressRequest, type ExpressResponse } from "../../_models";

import { checkRights, getFilteredData } from "../../middleware";
import IntegrationController from "../controllers/integration.controller";

const router = express.Router();

router.post(
  "/format-address",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.SOLI_BOT]),
  formatAddressDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const formattedAddress = await IntegrationController.formatAddress(
        req.bodyValidated
      );
      return res.status(200).json(formattedAddress);
    } catch (err) {
      req.log.error(err, "FORMAT_ADDRESS_FAILED");
      return res.status(400).json({ message: "FORMAT_ADDRESS_FAILED" });
    }
  }
);

router.post(
  "/search-duplicates",
  checkRights([
    UserStatus.ADMIN_SOLIGUIDE,
    UserStatus.ADMIN_TERRITORY,
    UserStatus.SOLI_BOT,
  ]),
  checkDuplicatesByPlaceDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const duplicates = await checkDuplicatesByPlace(req);

      if (duplicates.length) {
        return res.status(200).json(duplicates);
      } else {
        return res.status(204).json(null);
      }
    } catch (err) {
      req.log.error(err, "SEARCH_DUPLICATES_FAILED");
      return res.status(400).json({ message: "SEARCH_DUPLICATES_FAILED" });
    }
  }
);

export default router;
