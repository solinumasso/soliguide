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
import express from "express";

import { UserStatus } from "@soliguide/common";

import { checkRights } from "../../middleware";

import { ExpressRequest, ExpressResponse } from "../../_models";

import { resetAirtableSync } from "../services/airtable-sync.service";
import { setIsOpenToday } from "../../place/services/isOpenToday.service";

const router = express.Router();

/**
 * @swagger
 *
 * /ops/reset-at-sync:
 *   post:
 *     description: Reset Airtable synchronization by setting lastSync to null for all non-excluded entities
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
  "/reset-at-sync",
  checkRights([UserStatus.ADMIN_SOLIGUIDE]),
  async (req: ExpressRequest, res: ExpressResponse) => {
    try {
      req.log.info("OPS - RESET AT SYNC\tSTART");

      const result = await resetAirtableSync();

      req.log.info("OPS - RESET AT SYNC\tEND");

      return res.status(200).json({
        message: "AT_SYNC_RESET_SUCCESS",
        ...result,
      });
    } catch (e) {
      req.log.error(e, "AT_SYNC_RESET_ERROR");
      return res.status(500).json({ message: "AT_SYNC_RESET_ERROR" });
    }
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
