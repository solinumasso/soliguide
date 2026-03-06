import express, { NextFunction } from "express";

import { ApiPlace, PlaceType, UserStatus } from "@soliguide/common";

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
import { searchAdminDto } from "../../search/dto";
import { searchPlaces } from "../../search/controllers/search.controller";
import { searchUserDto } from "../../user/dto";
import { searchUsers as searchUsersController } from "../../user/controllers/user-admin.controller";

const router = express.Router();

/**
 * @swagger
 *
 * /ops/reset-at-sync/users/search:
 *   post:
 *     description: Send users found with search to rabbitMQ to sync them with AT
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
  "/reset-at-sync/users/search",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  searchUserDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      req.bodyValidated.options.limit = 0;

      req.updatedUsers = (
        await searchUsersController(req.bodyValidated, req.user)
      ).results as UserPopulateType[];

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
 * /ops/reset-at-sync/places/search:
 *   post:
 *     description: Send places found with search to rabbitMQ to sync them with AT
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
  "/reset-at-sync/places/search",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  searchAdminDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const searchData = req.bodyValidated;
    const context =
      searchData.placeType === PlaceType.PLACE
        ? "MANAGE_PLACE"
        : "MANAGE_PARCOURS";

    searchData.options.limit = 0;

    try {
      req.updatedPlaces = (
        await searchPlaces(
          req.requestInformation.categoryService,
          req.user,
          searchData,
          context
        )
      ).places as ModelWithId<ApiPlace>[];

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
