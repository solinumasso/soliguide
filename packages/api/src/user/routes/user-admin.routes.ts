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
import express, { type NextFunction } from "express";

import { UserStatus } from "@soliguide/common";

import * as UserAdminController from "../controllers/user-admin.controller";

import { searchUserDto } from "../dto";
import { validObjectIdDto } from "../../_utils/dto";

import type {
  ExpressRequest,
  ExpressResponse,
  UserPopulateType,
} from "../../_models";

import { checkRights, getUserFromUrl, getFilteredData } from "../../middleware";
import { sendUserChangesToMq } from "../middlewares/send-user-changes-event-to-mq.middleware";

const router = express.Router();
/**
 * @swagger
 *
 * /search:
 *   get:
 *     description: search a user corresponding to the query in param
 *     tags: [Users]
 *
 */
router.post(
  "/search/",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  searchUserDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      const results = await UserAdminController.searchUsers(
        req.bodyValidated,
        req.user
      );
      return res.status(200).json(results);
    } catch (e) {
      req.log.error(e, "SEARCH_ORGAS_ERROR");
      return res.status(500).json({ message: "SEARCH_ORGAS_ERROR" });
    }
  }
);

/**
 * @swagger
 *
 * /users/removeFromDev:
 *   patch:
 *     description: manage organization validate the user account
 *     tags: [Users]
 *     parameters:
 *       - name: _id
 *         in: formData
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: ACCOUNT_VALIDATED
 *       400 :
 *         description: BAD_REQUEST
 */
router.patch(
  "/removeFromDev/",
  checkRights([UserStatus.ADMIN_SOLIGUIDE]),
  validObjectIdDto,
  getFilteredData,
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      return res.status(200).json({ message: "USER_REMOVED" });
    } catch (e) {
      req.log.error(e, "REMOVE_FROM_DEV_IMPOSSIBLE");
      return res.status(400).json({ message: "REMOVE_FROM_DEV_IMPOSSIBLE" });
    }
  }
);

/**
 * @swagger
 *
 * /users/createDevToken/{id}:
 *   get:
 *     description: Create partner token
 *     tags: [Users]
 *     parameters:
 *       - name: userObjectId
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: devToken
 *       400 :
 *         description: Mongo Error
 */
router.get(
  "/createDevToken/:userObjectId",
  checkRights([UserStatus.ADMIN_SOLIGUIDE]),
  async (req: ExpressRequest, res: ExpressResponse) => {
    const userObjectId = req.params.userObjectId;
    try {
      const user = await UserAdminController.createDevToken(userObjectId);

      if (user) {
        return res.status(200).json(user.devToken);
      }
    } catch (e) {
      req.log.error(e, "DEV_TOKEN_CREATION_ERROR");
    }
    return res.status(400).json({ message: "DEV_TOKEN_CREATION_ERROR" });
  }
);

/**
 * @swagger
 *
 * /users/{id}:
 *   delete:
 *     description: delete an user
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: USER_DELETED
 *       400 :
 *         description: Mongo Error
 */
router.delete(
  "/:userObjectId",
  checkRights([UserStatus.ADMIN_SOLIGUIDE, UserStatus.ADMIN_TERRITORY]),
  getUserFromUrl,
  async (
    req: ExpressRequest & {
      selectedUser: Required<UserPopulateType>;
      isUserDeleted: boolean;
    },
    res: ExpressResponse,
    next: NextFunction
  ) => {
    try {
      await UserAdminController.deleteUser(req.selectedUser, req.log);

      req.updatedUser = req.selectedUser;
      req.isUserDeleted = true;

      res.status(200).json({ message: "USER_DELETED" });

      return next();
    } catch (e) {
      req.log.error(e, "DELETE_USER_FAIL");
      return res.status(400).json({ message: "DELETE_USER_FAIL" });
    }
  },
  sendUserChangesToMq
);

export default router;
