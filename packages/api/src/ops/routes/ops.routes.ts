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
import express, { NextFunction } from "express";

import { ApiPlace, UserStatus } from "@soliguide/common";

import {
  checkRights,
  getFilteredData,
  canGetOrEditUser,
  syncUsersAndNext,
  syncPlacesAndNext,
} from "../../middleware";

import {
  ExpressRequest,
  ExpressResponse,
  ModelWithId,
  UserPopulateType,
} from "../../_models";

import { setIsOpenToday } from "../../place/services/isOpenToday.service";
import { findPlacesByParams } from "../../place/services/place.service";
import { searchUsers } from "../../user/services";
import { idsToSyncDto } from "../dto";
import { canEditPlace } from "../../user/controllers/user-rights.controller";

const router = express.Router();

/**
 * @swagger
 *
 * /ops/reset-at-sync/users/all:
 *   post:
 *     description: Send all users to rabbitMQ to sync them with AT
 *     tags: [Ops]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: AT_SYNC_RESET_SUCCESS
 *       500:
 *         description: AT_SYNC_RESET_ERROR
 *     security:
 *      - bearerAuth: []
 */
router.post(
  "/reset-at-sync/users/all",
  checkRights([UserStatus.ADMIN_SOLIGUIDE]),
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      req.updatedUsers = await searchUsers({});

      return next();
    } catch (e) {
      req.log.error(e, "AT_SYNC_RESET_ERROR");
      return res.status(500).json({ message: "AT_SYNC_RESET_ERROR" });
    }
  },
  syncUsersAndNext,
  (_req: ExpressRequest, res: ExpressResponse) => {
    return res.status(200).json({
      message: "AT_SYNC_RESET_SUCCESS",
    });
  }
);

/**
 * @swagger
 *
 * /ops/reset-at-sync/places/all:
 *   post:
 *     description: Send all places to rabbitMQ to sync them with AT
 *     tags: [Ops]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: AT_SYNC_RESET_SUCCESS
 *       500:
 *         description: AT_SYNC_RESET_ERROR
 *     security:
 *      - bearerAuth: []
 */
router.post(
  "/reset-at-sync/places/all",
  checkRights([UserStatus.ADMIN_SOLIGUIDE]),
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      req.updatedPlaces = await findPlacesByParams({}, true);

      return next();
    } catch (e) {
      req.log.error(e, "AT_SYNC_RESET_ERROR");
      return res.status(500).json({ message: "AT_SYNC_RESET_ERROR" });
    }
  },
  syncPlacesAndNext,
  (_req: ExpressRequest, res: ExpressResponse) => {
    return res.status(200).json({
      message: "AT_SYNC_RESET_SUCCESS",
    });
  }
);

/**
 * @swagger
 *
 * /ops/reset-at-sync/users:
 *   post:
 *     description: Send selected users to rabbitMQ to sync them with AT
 *     tags: [Ops]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: AT_SYNC_RESET_SUCCESS
 *       500:
 *         description: AT_SYNC_RESET_ERROR
 *     security:
 *      - bearerAuth: []
 */
router.post(
  "/reset-at-sync/users",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  idsToSyncDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      req.updatedUsers = await searchUsers({
        user_id: { $in: req.bodyValidated.idsToSync },
      });

      return next();
    } catch (e) {
      req.log.error(e, "AT_SYNC_RESET_ERROR");
      return res.status(500).json({ message: "AT_SYNC_RESET_ERROR" });
    }
  },
  async (
    req: ExpressRequest & { updatedUsers: UserPopulateType[] },
    _res: ExpressResponse,
    next: NextFunction
  ) => {
    req.updatedUsers = await Promise.all(
      req.updatedUsers.filter(
        async (user) => await canGetOrEditUser(req.user, user)
      )
    );

    return next();
  },
  syncUsersAndNext,
  (_req: ExpressRequest, res: ExpressResponse) => {
    return res.status(200).json({
      message: "AT_SYNC_RESET_SUCCESS",
    });
  }
);

/**
 * @swagger
 *
 * /ops/reset-at-sync/places:
 *   post:
 *     description: Send selected places to rabbitMQ to sync them with AT
 *     tags: [Ops]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: AT_SYNC_RESET_SUCCESS
 *       500:
 *         description: AT_SYNC_RESET_ERROR
 *     security:
 *      - bearerAuth: []
 */
router.post(
  "/reset-at-sync/places",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  idsToSyncDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      req.updatedPlaces = await findPlacesByParams(
        {
          lieu_id: { $in: req.bodyValidated.idsToSync },
        },
        true
      );

      return next();
    } catch (e) {
      req.log.error(e, "AT_SYNC_RESET_ERROR");
      return res.status(500).json({ message: "AT_SYNC_RESET_ERROR" });
    }
  },
  async (
    req: ExpressRequest & { updatedPlaces: ModelWithId<ApiPlace>[] },
    _res: ExpressResponse,
    next: NextFunction
  ) => {
    req.updatedPlaces = await Promise.all(
      req.updatedPlaces.filter(
        async (place) => await canEditPlace(req.user, place)
      )
    );

    return next();
  },
  syncPlacesAndNext,
  (_req: ExpressRequest, res: ExpressResponse) => {
    return res.status(200).json({
      message: "AT_SYNC_RESET_SUCCESS",
    });
  }
);

/**
 * @swagger
 *
 * /ops/compute-is-open-today:
 *   post:
 *     description: Run the isOpenToday cron job to compute opening status for all places
 *     tags: [Ops]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: IS_OPEN_TODAY_SUCCESS
 *       500:
 *         description: IS_OPEN_TODAY_ERROR
 *     security:
 *      - bearerAuth: []
 */
router.post(
  "/compute-is-open-today",
  checkRights([UserStatus.ADMIN_SOLIGUIDE]),
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      req.log.info("OPS - SET IS_OPEN_TODAY FOR PLACES\tSTART");

      await setIsOpenToday();

      req.log.info("OPS - SET IS_OPEN_TODAY FOR PLACES\tEND");

      return res.status(200).json({ message: "IS_OPEN_TODAY_SUCCESS" });
    } catch (e) {
      req.log.error(e, "IS_OPEN_TODAY_ERROR");
      return res.status(500).json({ message: "IS_OPEN_TODAY_ERROR" });
    }
  }
);

export default router;
